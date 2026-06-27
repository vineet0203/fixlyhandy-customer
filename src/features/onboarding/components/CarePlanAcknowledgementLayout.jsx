/**
 * CarePlanAcknowledgementLayout.jsx
 *
 * Custom form layout for "410-Care Plan Acknowledgement_TX.pdf"
 * Acknowledgement form for Service Plan / Individual Care Plan.
 */
import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Header acknowledgement
  PRINT_NAME: 'Print First and Last Name',
  
  // Client Info
  CLIENT_NAME: 'Client Name',
  DOB: 'DOB',
  
  // Comments
  COMMENTS: 'Comments 1',
  
  // Employee Signature Section
  EMPLOYEE_SIGNATURE: 'Employee Signature',
  EMPLOYEE_DATE: 'Date',
  EMPLOYEE_PRINT_NAME: 'Employee Print Name',
  
  // Client Signature Section
  CLIENT_SIGNATURE: 'Client Signature',
  CLIENT_DATE: 'Date_2',
  
  // Mastercare Representative Section
  REP_SIGNATURE: 'Mastercare Representative Signature',
  REP_DATE: 'Date_3',
  REP_PRINT_NAME: 'Mastercare Representative Print Name',
};

/**
 * Auto-sync mapping
 */
export const CARE_PLAN_ACK_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SignatureSection = ({ title, caption, children }) => (
  <Box
    sx={{
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      p: 2,
      mb: 2.5,
      bgcolor: '#fafafa',
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: caption ? 0.25 : 1.5, color: '#1e3a5f' }}>
      {title}
    </Typography>
    {caption && (
      <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1.5 }}>
        {caption}
      </Typography>
    )}
    {children}
  </Box>
);

// ─── Main Component ─────────────────────────────────────────────────────

const CarePlanAcknowledgementLayout = ({
  formValues = {},
  checkboxValues = {},
  signatureValues = {},
  onFormChange,
  onCheckboxChange,
  onSignatureChange,
  disabled = false,
}) => {
  // ── Handlers ──
  const handleText = (fieldName) => (e) => {
    onFormChange({ ...formValues, [fieldName]: e.target.value });
  };

  const handleSignature = (fieldName) => (dataUrl) => {
    onSignatureChange({ ...signatureValues, [fieldName]: dataUrl });
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}>
          Care Plan Acknowledgement
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          ACKNOWLEDGEMENT TEXT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 1, mb: 3 }}>
          <Typography variant="body1" sx={{ lineHeight: 2.5 }}>I,</Typography>
          <TextField
            size="small"
            label="Print First and Last Name"
            value={formValues[F.PRINT_NAME] || ''}
            onChange={handleText(F.PRINT_NAME)}
            disabled={disabled}
            placeholder="Enter your full name"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 300 }}
          />
          <Typography variant="body1" sx={{ lineHeight: 2.5 }}>, have been informed of the current</Typography>
        </Box>

        <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333', mb: 3 }}>
          Service Plan / Individual Care Plan by Mastercare for the following client and have carefully 
          read and understand the services identified for this client.
        </Typography>

        {/* Client Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Client Name"
              value={formValues[F.CLIENT_NAME] || ''}
              onChange={handleText(F.CLIENT_NAME)}
              disabled={disabled}
              placeholder="Enter client's full name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="DOB"
              value={formValues[F.DOB] || ''}
              onChange={handleText(F.DOB)}
              disabled={disabled}
              helperText="Client's date of birth"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          COMMENTS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem', mb: 1 }}
        >
          Comments
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Comments"
          value={formValues[F.COMMENTS] || ''}
          onChange={handleText(F.COMMENTS)}
          disabled={disabled}
          placeholder="Enter any additional comments or notes about the care plan..."
          InputLabelProps={{ shrink: true }}
        />
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SIGNATURES
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem', textTransform: 'uppercase', mb: 1 }}
        >
          Signatures
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Employee Signature */}
        <SignatureSection 
          title="Employee Signature" 
          caption="The employee assigned to this client must sign below"
        >
          <SignaturePad
            label="Employee Signature - Sign here"
            value={signatureValues[F.EMPLOYEE_SIGNATURE]}
            onChange={handleSignature(F.EMPLOYEE_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.EMPLOYEE_DATE] || ''}
                onChange={handleText(F.EMPLOYEE_DATE)}
                disabled={disabled}
                helperText="Date of signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Employee Print Name"
                value={formValues[F.EMPLOYEE_PRINT_NAME] || ''}
                onChange={handleText(F.EMPLOYEE_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter employee's printed name"
                helperText="Employee's full name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>

        {/* Client Signature */}
        <SignatureSection 
          title="Client Signature" 
          caption="The client must sign below to acknowledge the care plan"
        >
          <SignaturePad
            label="Client Signature - Sign here"
            value={signatureValues[F.CLIENT_SIGNATURE]}
            onChange={handleSignature(F.CLIENT_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.CLIENT_DATE] || ''}
                onChange={handleText(F.CLIENT_DATE)}
                disabled={disabled}
                helperText="Date of signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>

        {/* Mastercare Representative Signature */}
        <SignatureSection 
          title="Mastercare Representative Signature" 
          caption="To be completed by Mastercare representative"
        >
          <SignaturePad
            label="Mastercare Representative Signature - Sign here"
            value={signatureValues[F.REP_SIGNATURE]}
            onChange={handleSignature(F.REP_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.REP_DATE] || ''}
                onChange={handleText(F.REP_DATE)}
                disabled={disabled}
                helperText="Date of signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Mastercare Representative Print Name"
                value={formValues[F.REP_PRINT_NAME] || ''}
                onChange={handleText(F.REP_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter representative's printed name"
                helperText="Representative's full name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>
      </Paper>
    </Box>
  );
};

export default CarePlanAcknowledgementLayout;
