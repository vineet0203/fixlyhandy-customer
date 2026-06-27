/**
 * pdfFormFiller.js
 *
 * Utility for extracting interactive form fields from AcroForm PDFs
 * and filling them programmatically using pdf-lib.
 *
 * Supports: PDFTextField, PDFCheckBox, PDFRadioGroup, PDFSignature,
 * and text fields whose names indicate they are signature fields.
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ─── Field name → type detection helpers ────────────────────────────────

const SIGNATURE_NAME_PATTERNS = [
  /signature/i,
  /_es_:signer/i,
  /^sig\d*$/i,
];

const DATE_NAME_PATTERNS = [
  /^date/i,
  /date$/i,
  /\bdate\b/i,
  /\bdob\b/i,
  /date_?\d*$/i,
];

/**
 * Check if a field name looks like a signature field.
 */
function isSignatureFieldName(name) {
  return SIGNATURE_NAME_PATTERNS.some((p) => p.test(name));
}

/**
 * Check if a field name looks like a date field.
 */
function isDateFieldName(name) {
  return DATE_NAME_PATTERNS.some((p) => p.test(name));
}

/**
 * Clean up a PDF field name into a human-readable label.
 *  - "Client Name" → "Client Name"
 *  - "undefined_5" → "Other"
 *  - "1_2" → "Field 1-2"
 *  - "Signature93_es_:signer:signature" → "Signature"
 *  - "AssessmentComments1" → "Assessment Comments 1"
 */
export function fieldNameToLabel(name) {
  if (!name) return 'Field';

  // Signature fields
  if (/signature\d*_es_/i.test(name)) return 'Signature';
  if (/^signature$/i.test(name)) return 'Signature';

  // undefined_N fields
  if (/^undefined(_\d+)?$/.test(name)) return 'Other';

  // Purely numeric like "1_2", "3_4"
  if (/^\d+(_\d+)?$/.test(name)) return `Field ${name.replace(/_/g, '-')}`;

  // CamelCase split: "AssessmentComments1" → "Assessment Comments 1"
  let label = name
    .replace(/_es_.*$/i, '')          // remove _es_:signer:... suffix
    .replace(/([a-z])(\d)/g, '$1 $2') // "Comments1" → "Comments 1"
    .replace(/([a-z])([A-Z])/g, '$1 $2') // "CamelCase" → "Camel Case"
    .replace(/_/g, ' ')               // underscores → spaces
    .replace(/\s+/g, ' ')
    .trim();

  // Title case each word
  if (label) {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }

  return label || 'Field';
}

// ─── Extract form fields from a PDF ─────────────────────────────────────

/**
 * Extract all interactive form fields from a PDF document.
 *
 * @param {ArrayBuffer|Uint8Array} pdfBytes - Raw PDF bytes
 * @returns {Promise<Array<{
 *   name: string,
 *   type: 'text'|'checkbox'|'radio'|'signature'|'date',
 *   label: string,
 *   page: number,
 *   y: number,
 *   x: number,
 *   required: boolean,
 *   options?: string[],
 * }>>}
 */
export async function extractFormFields(pdfBytes) {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const pageCount = pdfDoc.getPageCount();

  const extracted = [];

  for (const field of fields) {
    const name = field.getName();
    const typeName = field.constructor.name; // PDFTextField, PDFCheckBox, etc.

    // Get widget (first one) to determine page and position
    let page = 0;
    let x = 0;
    let y = 0;

    try {
      const widgets = field.acroField.getWidgets();
      if (widgets.length > 0) {
        const rect = widgets[0].getRectangle();
        x = rect.x;
        y = rect.y;

        // Determine which page this widget is on
        const widgetRef = widgets[0].dict;
        for (let i = 0; i < pageCount; i++) {
          const pageObj = pdfDoc.getPage(i);
          pageObj.node.lookupMaybe(
            // PDFName for "Annots"
            pdfDoc.context.obj('Annots'),
            // fallback
          );
          // Simpler: just use the page index from annotation
        }
        // Fallback: use y coordinate for ordering, page detection through dict
        // The page detection from widgets is complex; we'll use a simple heuristic
        // based on the widget's P entry or fall back to page 0
        try {
          const pEntry = widgetRef.get(pdfDoc.context.obj('P'));
          if (pEntry) {
            for (let i = 0; i < pageCount; i++) {
              if (pdfDoc.getPage(i).ref === pEntry) {
                page = i;
                break;
              }
            }
          }
        } catch {
          // If page detection fails, fields will be sorted by y coordinate
        }
      }
    } catch {
      // Widget access failed, use defaults
    }

    // Determine logical field type
    let type = 'text';
    let options = undefined;

    if (typeName === 'PDFCheckBox') {
      type = 'checkbox';
    } else if (typeName === 'PDFRadioGroup') {
      type = 'radio';
      try {
        options = field.getOptions();
      } catch {
        options = ['Yes', 'No'];
      }
    } else if (typeName === 'PDFSignature' || isSignatureFieldName(name)) {
      type = 'signature';
    } else if (typeName === 'PDFTextField') {
      if (isDateFieldName(name)) {
        type = 'date';
      }
    }

    extracted.push({
      name,
      type,
      label: fieldNameToLabel(name),
      page,
      y,
      x,
      required: false,
      options,
    });
  }

  // Sort by page, then by y descending (top of page first), then x ascending (left to right)
  extracted.sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    if (Math.abs(a.y - b.y) > 15) return b.y - a.y; // top first (higher y = higher on page)
    return a.x - b.x; // left to right for same row
  });

  return extracted;
}

/**
 * Get the total page count from a PDF.
 */
export async function getPdfPageCount(pdfBytes) {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

// ─── Fill PDF form fields ───────────────────────────────────────────────

/**
 * Fill a PDF's interactive form fields with the provided values and signatures.
 *
 * @param {ArrayBuffer|Uint8Array} templateBytes - The blank template PDF
 * @param {Object} fieldValues - { fieldName: value } for text/date/radio fields
 * @param {Object} checkboxValues - { fieldName: boolean } for checkbox fields
 * @param {Object} signatureDataUrls - { fieldName: dataUrl } for signature fields
 * @returns {Promise<Uint8Array>} - The filled PDF bytes
 */
export async function fillPdfForm(templateBytes, fieldValues = {}, checkboxValues = {}, signatureDataUrls = {}) {
  const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  // Fill text and date fields
  for (const [fieldName, value] of Object.entries(fieldValues)) {
    if (value == null || value === '') continue;
    try {
      const field = form.getTextField(fieldName);
      field.setText(String(value));
    } catch (err) {
      // Field might not exist or might be a different type - skip silently
      console.warn(`Could not set text for field "${fieldName}":`, err.message);
    }
  }

  // Fill checkboxes
  for (const [fieldName, checked] of Object.entries(checkboxValues)) {
    try {
      const field = form.getCheckBox(fieldName);
      if (checked) {
        field.check();
      } else {
        field.uncheck();
      }
    } catch (err) {
      console.warn(`Could not set checkbox "${fieldName}":`, err.message);
    }
  }

  // Fill radio groups
  for (const [fieldName, value] of Object.entries(fieldValues)) {
    if (value == null || value === '') continue;
    try {
      const field = form.getRadioGroup(fieldName);
      field.select(String(value));
    } catch {
      // Not a radio group - ignore
    }
  }

  // Embed signatures as images on top of signature fields
  for (const [fieldName, dataUrl] of Object.entries(signatureDataUrls)) {
    if (!dataUrl) continue;
    try {
      // Get field widget rectangle for positioning
      let field;
      try {
        field = form.getField(fieldName);
      } catch {
        continue;
      }

      const widgets = field.acroField.getWidgets();
      if (widgets.length === 0) continue;

      const rect = widgets[0].getRectangle();

      // Convert data URL to image bytes
      const base64 = dataUrl.split(',')[1];
      const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      let image;
      if (dataUrl.includes('image/png')) {
        image = await pdfDoc.embedPng(imgBytes);
      } else {
        image = await pdfDoc.embedJpg(imgBytes);
      }

      const dims = image.scaleToFit(rect.width, rect.height);

      // Find the page this widget belongs to and draw the image
      const pages = pdfDoc.getPages();
      // Try to determine the page from the widget
      let targetPage = pages[0];
      try {
        const pEntry = widgets[0].dict.get(pdfDoc.context.obj('P'));
        if (pEntry) {
          for (let i = 0; i < pages.length; i++) {
            if (pages[i].ref === pEntry) {
              targetPage = pages[i];
              break;
            }
          }
        }
      } catch {
        // Fallback to page 0
      }

      targetPage.drawImage(image, {
        x: rect.x,
        y: rect.y,
        width: dims.width,
        height: dims.height,
      });

      // Try to clear the signature field appearance so image is visible
      try {
        // For text fields used as signature placeholders, clear the text
        if (field.constructor.name === 'PDFTextField') {
          field.setText('');
        }
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(`Failed to embed signature for "${fieldName}":`, err);
    }
  }

  // Flatten the form so fields become static content
  try {
    form.flatten();
  } catch (err) {
    console.warn('Could not flatten form:', err.message);
  }

  return await pdfDoc.save();
}

// ─── Standalone PDF fallback (no template) ──────────────────────────────

/**
 * Generate a standalone PDF with form data when template is unavailable.
 * Used for 790-Case Notes (no form fields) or when template download fails.
 */
export async function generateStandalonePdf(formData, templateName = 'Document', options = {}) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([612, 792]);
  let y = 750;
  const leftMargin = 50;

  // Helper to add new page if needed
  const ensureSpace = (needed = 18) => {
    if (y < 60 + needed) {
      page = pdfDoc.addPage([612, 792]);
      y = 750;
    }
    return page;
  };

  if (options.debugCoordinates) {
    const w = page.getWidth();
    const h = page.getHeight();
    for (let x = 0; x <= w; x += 50) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: h },
        thickness: 0.3,
        color: rgb(0.85, 0.85, 0.85),
      });
      page.drawText(String(x), {
        x: Math.min(x + 2, w - 20),
        y: h - 12,
        size: 7,
        font,
        color: rgb(0.45, 0.45, 0.45),
      });
    }
    for (let yy = 0; yy <= h; yy += 50) {
      page.drawLine({
        start: { x: 0, y: yy },
        end: { x: w, y: yy },
        thickness: 0.3,
        color: rgb(0.85, 0.85, 0.85),
      });
      page.drawText(String(yy), {
        x: 2,
        y: Math.min(yy + 2, h - 12),
        size: 7,
        font,
        color: rgb(0.45, 0.45, 0.45),
      });
    }
  }

  // Title
  page.drawText(templateName, {
    x: leftMargin,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0.12, 0.23, 0.37),
  });
  y -= 10;

  page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: leftMargin,
    y: y - 15,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 40;

  // Write all form data fields
  for (const [key, value] of Object.entries(formData)) {
    if (value == null || value === '' || value === false) continue;
    
    // Handle Case Notes array specially
    if (key === 'caseNotes' && Array.isArray(value)) {
      ensureSpace(40);
      page.drawText('Case Notes:', {
        x: leftMargin,
        y,
        size: 12,
        font: boldFont,
        color: rgb(0.12, 0.23, 0.37),
      });
      y -= 25;
      
      // Draw table header
      ensureSpace(20);
      page.drawText('Date', { x: leftMargin, y, size: 10, font: boldFont });
      page.drawText('Time', { x: leftMargin + 100, y, size: 10, font: boldFont });
      page.drawText('Notes', { x: leftMargin + 180, y, size: 10, font: boldFont });
      y -= 5;
      page.drawLine({ start: { x: leftMargin, y }, end: { x: 562, y }, thickness: 0.5 });
      y -= 15;
      
      // Draw each note entry
      for (const note of value) {
        if (!note.date && !note.time && !note.notes) continue;
        ensureSpace(40);
        
        page.drawText(note.date || '-', { x: leftMargin, y, size: 9, font });
        page.drawText(note.time || '-', { x: leftMargin + 100, y, size: 9, font });
        
        // Handle long notes with word wrap
        const notesText = note.notes || '-';
        const maxWidth = 330;
        const words = notesText.split(' ');
        let line = '';
        let lineY = y;
        
        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word;
          const testWidth = font.widthOfTextAtSize(testLine, 9);
          
          if (testWidth > maxWidth && line) {
            ensureSpace(15);
            page.drawText(line, { x: leftMargin + 180, y: lineY, size: 9, font });
            lineY -= 12;
            line = word;
          } else {
            line = testLine;
          }
        }
        if (line) {
          ensureSpace(15);
          page.drawText(line, { x: leftMargin + 180, y: lineY, size: 9, font });
          lineY -= 12;
        }
        
        y = Math.min(y - 20, lineY - 5);
        page.drawLine({ start: { x: leftMargin, y: y + 10 }, end: { x: 562, y: y + 10 }, thickness: 0.25, color: rgb(0.8, 0.8, 0.8) });
      }
      y -= 10;
      continue;
    }
    
    // Skip arrays/objects that aren't specially handled
    if (typeof value === 'object') continue;

    ensureSpace(18);
    const label = fieldNameToLabel(key);
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);

    page.drawText(`${label}: ${displayValue}`, {
      x: leftMargin,
      y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 18;
  }

  return await pdfDoc.save();
}

/**
 * Fill Case Notes PDF by overlaying text on the original template.
 * Used when PDF template has no fillable form fields.
 */
export async function fillCaseNotesPdf(templateBytes, formData, signatureValues = {}, options = {}) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const page = pages[0];
  
  // Text style config
  const pageHeight = 792;
  const textColor = rgb(0, 0, 0);

  // Helper to draw text (y is in top-origin coords, auto-converted to pdf-lib bottom-origin)
  const drawText = (text, x, yTop, size = 10) => {
    if (!text) return;
    const yPdf = pageHeight - yTop - size + 2; // baseline = pageHeight - boxBottom + descent
    page.drawText(String(text), { x, y: yPdf, size, font, color: textColor });
  };

  if (options.debugCoordinates) {
    const w = page.getWidth();
    const h = page.getHeight();

    // Draw a light coordinate grid every 50 points for manual calibration.
    for (let x = 0; x <= w; x += 50) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: h },
        thickness: 0.3,
        color: rgb(0.85, 0.85, 0.85),
      });
      page.drawText(String(x), {
        x: Math.min(x + 2, w - 20),
        y: h - 12,
        size: 7,
        font,
        color: rgb(0.45, 0.45, 0.45),
      });
    }
    for (let y = 0; y <= h; y += 50) {
      page.drawLine({
        start: { x: 0, y },
        end: { x: w, y },
        thickness: 0.3,
        color: rgb(0.85, 0.85, 0.85),
      });
      page.drawText(String(y), {
        x: 2,
        y: Math.min(y + 2, h - 12),
        size: 7,
        font,
        color: rgb(0.45, 0.45, 0.45),
      });
    }

    page.drawText('DEBUG COORDINATE GRID ENABLED', {
      x: 8,
      y: h - 24,
      size: 9,
      font: boldFont,
      color: rgb(0.8, 0.1, 0.1),
    });
  }

  const dataUrlToBytes = (dataUrl) => {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    const parts = dataUrl.split(',');
    if (parts.length !== 2) return null;
    const base64 = parts[1];
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  };

  // Header fields - exact coordinates from PDF template analysis (top-origin)
  // Client ID: [84, 93.2, 193, 103.9], Client Name: [243, 93.2, 560, 103.9]
  // Client DOB: [96, 108.4, 193, 119.8], Rep: [363, 108.4, 560, 119.8]
  drawText(formData['Client ID'], 84, 93.2, 9);
  drawText(formData['Client Name'], 243, 93.2, 9);
  drawText(formData['Client DOB'], 96, 108.4, 9);
  drawText(formData['Rep Name/Title'], 363, 108.4, 9);

  // Case Notes table - exact coordinates from PDF analysis (top-origin)
  // 37 rows: first row top=134.9, last row bottom=694.8, each ~15.5pt tall
  // Date: [54.7, row_top+1, 130.0], Time: [131.0, row_top+1, 192.0], Notes: [194.0, row_top+1, 559.7]
  const rowHeight = 15.55;
  const dateColX = 54.7;
  const timeColX = 131.0;
  const notesColX = 198.0; // 194 + 4pt right padding from column line
  const tableFontSize = 7;
  const maxNotesWidth = 559.7 - 194.0; // ~365pt
  const caseNotes = formData.caseNotes || [];
  
  for (let i = 0; i < caseNotes.length && i < 37; i++) {
    const note = caseNotes[i];
    if (!note.date && !note.time && !note.notes) continue;
    
    const rowTop = 134.9 + (i * rowHeight) + 1; // row_top + 1pt offset
    
    drawText(note.date || '', dateColX, rowTop, tableFontSize);
    drawText(note.time || '', timeColX, rowTop, tableFontSize);
    
    // Handle notes - single line that fits in the cell
    const notesText = note.notes || '';
    const availableWidth = maxNotesWidth;
    let truncated = notesText;
    // Truncate if too long for single row
    while (truncated.length > 0 && font.widthOfTextAtSize(truncated, tableFontSize) > availableWidth) {
      truncated = truncated.slice(0, -1);
    }
    drawText(truncated, notesColX, rowTop, tableFontSize);
  }

  // Note: This form template (790-Case Notes-TX.pdf) has no signature fields.
  // It only contains header fields and date/time/notes table.

  return await pdfDoc.save();
}
