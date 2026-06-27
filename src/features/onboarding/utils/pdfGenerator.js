// features/onboarding/utils/pdfGenerator.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Field coordinates for the "Consent for Homecare Service & Client Agreement" PDF.
 * Each field specifies: page (0-indexed), x, y, fontSize, maxWidth (optional).
 * All coordinates are in PDF points (1 point = 1/72 inch), origin = bottom-left.
 *
 * NOTE: These coordinates are placeholders. Adjust them by overlaying
 * the actual PDF and measuring field positions.
 */
const FIELD_MAP = {
  // ─── PAGE 1: Consent for Homecare Service ───
  clientName:        { page: 0, x: 100, y: 660, fontSize: 10 },
  address:           { page: 0, x: 100, y: 635, fontSize: 10 },
  phoneNumber:       { page: 0, x: 100, y: 610, fontSize: 10 },
  dateOfBirth:       { page: 0, x: 400, y: 610, fontSize: 10 },
  emergencyContact:  { page: 0, x: 100, y: 585, fontSize: 10 },
  emergencyPhone:    { page: 0, x: 400, y: 585, fontSize: 10 },

  // Consent checkboxes area
  consentInitials:   { page: 0, x: 500, y: 400, fontSize: 10 },

  // Signatures at the bottom of page 1
  clientSignature:   { page: 0, x:  70, y: 140, width: 200, height: 50 },
  signatureDate:     { page: 0, x: 350, y: 150, fontSize: 10 },
  witnessName:       { page: 0, x:  70, y:  85, fontSize: 10 },
  witnessSignature:  { page: 0, x: 350, y:  85, width: 200, height: 50 },

  // ─── PAGE 2: Client Agreement ───
  agreementClientName: { page: 1, x: 100, y: 700, fontSize: 10 },
  servicePlan:         { page: 1, x: 100, y: 660, fontSize: 10, maxWidth: 420 },
  startDate:          { page: 1, x: 100, y: 610, fontSize: 10 },
  ratePerHour:        { page: 1, x: 300, y: 610, fontSize: 10 },
  hoursPerWeek:       { page: 1, x: 450, y: 610, fontSize: 10 },

  // Agreement signatures at bottom of page 2
  clientSignaturePage2: { page: 1, x:  70, y: 140, width: 200, height: 50 },
  datePage2:            { page: 1, x: 350, y: 150, fontSize: 10 },
  representativeName:   { page: 1, x:  70, y:  85, fontSize: 10 },
  repSignature:         { page: 1, x: 350, y:  85, width: 200, height: 50 },
};

/**
 * Generate a filled PDF from form data and a template PDF.
 *
 * @param {Uint8Array|ArrayBuffer} templateBytes - The original blank PDF bytes
 * @param {Object} formData - Key-value pairs matching FIELD_MAP keys
 * @param {Object} signatures - { clientSignature: dataUrl, witnessSignature: dataUrl, ... }
 * @returns {Promise<Uint8Array>} - The filled PDF bytes
 */
export async function generateFilledPdf(templateBytes, formData, signatures = {}) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  // Draw text fields
  for (const [key, value] of Object.entries(formData)) {
    const field = FIELD_MAP[key];
    if (!field || value == null || value === '') continue;

    const page = pages[field.page];
    if (!page) continue;

    const text = String(value);
    page.drawText(text, {
      x: field.x,
      y: field.y,
      size: field.fontSize || 10,
      font,
      color: rgb(0, 0, 0),
      maxWidth: field.maxWidth || undefined,
    });
  }

  // Draw signature images
  for (const [key, dataUrl] of Object.entries(signatures)) {
    const field = FIELD_MAP[key];
    if (!field || !dataUrl) continue;

    const page = pages[field.page];
    if (!page) continue;

    try {
      // Convert data URL to bytes
      const base64 = dataUrl.split(',')[1];
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      let image;
      if (dataUrl.includes('image/png')) {
        image = await pdfDoc.embedPng(bytes);
      } else {
        image = await pdfDoc.embedJpg(bytes);
      }

      const dims = image.scaleToFit(field.width || 200, field.height || 50);
      page.drawImage(image, {
        x: field.x,
        y: field.y,
        width: dims.width,
        height: dims.height,
      });
    } catch (err) {
      console.error(`Failed to embed signature for ${key}:`, err);
    }
  }

  return await pdfDoc.save();
}

/**
 * Download PDF bytes as a file in the browser.
 */
export function downloadPdfBlob(pdfBytes, fileName = 'completed-form.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert PDF bytes to a Blob suitable for upload.
 */
export function pdfBytesToBlob(pdfBytes) {
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export { FIELD_MAP };
