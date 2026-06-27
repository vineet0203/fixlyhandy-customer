/**
 * DynamicPdfForm.jsx
 *
 * A universal form component that renders form inputs dynamically
 * based on fields extracted from a PDF template using pdf-lib.
 * Works for all 15 onboarding document templates.
 */
import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Paper,
  Chip,
} from '@mui/material';
import SignaturePad from './SignaturePad';

/**
 * Group fields by page number for section rendering.
 */
function groupFieldsByPage(fields) {
  const groups = {};
  for (const field of fields) {
    const page = field.page || 0;
    if (!groups[page]) groups[page] = [];
    groups[page].push(field);
  }
  return groups;
}

/**
 * Determine grid sizing based on field type and label length.
 */
function getGridSize(field) {
  if (field.type === 'signature') return { xs: 12, md: 6 };
  if (field.type === 'checkbox') return { xs: 12, sm: 6, md: 4 };
  if (field.type === 'radio') return { xs: 12 };
  if (field.label.length > 40) return { xs: 12 };
  if (field.type === 'date') return { xs: 12, sm: 6, md: 4 };
  return { xs: 12, sm: 6 };
}

/**
 * Check if a field should be hidden from the form.
 * Some PDF fields are purely decorative or auto-filled.
 */
function shouldHideField(field) {
  // Hide fields with purely numeric names that aren't meaningful
  // But keep numbered fields like "1_2" that could be medication rows
  return false; // Show all fields - user knows their forms best
}

const DynamicPdfForm = ({
  fields = [],
  formValues = {},
  checkboxValues = {},
  signatureValues = {},
  onFormChange,
  onCheckboxChange,
  onSignatureChange,
  disabled = false,
  templateName = 'Document',
}) => {
  const pageGroups = useMemo(() => groupFieldsByPage(fields), [fields]);
  const pageNumbers = useMemo(() => Object.keys(pageGroups).sort((a, b) => a - b), [pageGroups]);
  const totalPages = pageNumbers.length;

  if (fields.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          This document has no fillable fields. Please add any notes below.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          label="Notes / Comments"
          value={formValues['_notes'] || ''}
          onChange={(e) => onFormChange({ ...formValues, _notes: e.target.value })}
          disabled={disabled}
          sx={{ mt: 2 }}
        />
      </Paper>
    );
  }

  const handleTextChange = (fieldName) => (e) => {
    onFormChange({ ...formValues, [fieldName]: e.target.value });
  };

  const handleCheckboxToggle = (fieldName) => (e) => {
    onCheckboxChange({ ...checkboxValues, [fieldName]: e.target.checked });
  };

  const handleRadioChange = (fieldName) => (e) => {
    onFormChange({ ...formValues, [fieldName]: e.target.value });
  };

  const handleSignature = (fieldName) => (dataUrl) => {
    onSignatureChange({ ...signatureValues, [fieldName]: dataUrl });
  };

  return (
    <Box>
      {pageNumbers.map((pageNum, pageIdx) => {
        const pageFields = pageGroups[pageNum].filter((f) => !shouldHideField(f));
        if (pageFields.length === 0) return null;

        // Separate fields by type for better layout
        const textFields = pageFields.filter((f) => f.type === 'text' || f.type === 'date');
        const checkboxFields = pageFields.filter((f) => f.type === 'checkbox');
        const radioFields = pageFields.filter((f) => f.type === 'radio');
        const signatureFields = pageFields.filter((f) => f.type === 'signature');

        return (
          <Paper key={pageNum} elevation={2} sx={{ p: 3, mb: 3 }}>
            {/* Page header */}
            {totalPages > 1 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    label={`Page ${parseInt(pageNum) + 1}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
                    {pageIdx === 0 ? templateName : `${templateName} (cont.)`}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
            {totalPages === 1 && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
                  {templateName}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </>
            )}

            {/* Text & Date fields */}
            {textFields.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#555' }}>
                  Information Fields
                </Typography>
                <Grid container spacing={2}>
                  {textFields.map((field) => {
                    const gridSize = getGridSize(field);
                    const isMultiline = field.label.toLowerCase().includes('comment') ||
                      field.label.toLowerCase().includes('note') ||
                      field.label.toLowerCase().includes('describe') ||
                      field.label.toLowerCase().includes('problems');

                    return (
                      <Grid item key={field.name} {...gridSize}>
                        <TextField
                          fullWidth
                          label={field.label}
                          type={field.type === 'date' ? 'date' : 'text'}
                          value={formValues[field.name] || ''}
                          onChange={handleTextChange(field.name)}
                          disabled={disabled}
                          size="small"
                          multiline={isMultiline}
                          rows={isMultiline ? 3 : undefined}
                          InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                          placeholder={field.name} // Show original field name as placeholder
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Checkbox fields */}
            {checkboxFields.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                  Check all that apply
                </Typography>
                <Grid container spacing={0}>
                  {checkboxFields.map((field) => {
                    const gridSize = getGridSize(field);
                    return (
                      <Grid item key={field.name} {...gridSize}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!checkboxValues[field.name]}
                              onChange={handleCheckboxToggle(field.name)}
                              disabled={disabled}
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {field.label}
                            </Typography>
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Radio group fields */}
            {radioFields.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {radioFields.map((field) => (
                  <FormControl key={field.name} component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {field.label}
                    </FormLabel>
                    <RadioGroup
                      row
                      value={formValues[field.name] || ''}
                      onChange={handleRadioChange(field.name)}
                    >
                      {(field.options || ['Yes', 'No']).map((opt) => (
                        <FormControlLabel
                          key={opt}
                          value={opt}
                          control={<Radio size="small" disabled={disabled} />}
                          label={opt}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                ))}
              </Box>
            )}

            {/* Signature fields */}
            {signatureFields.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#555' }}>
                  Signatures
                </Typography>
                <Grid container spacing={3}>
                  {signatureFields.map((field) => (
                    <Grid item key={field.name} xs={12} md={6}>
                      <SignaturePad
                        label={field.label}
                        onChange={handleSignature(field.name)}
                        disabled={disabled}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default DynamicPdfForm;
