/**
 * ClientHandbookAcknowledgementLayout.jsx
 *
 * Custom form layout for "350-Client Handbook Acknowledgement_TX.pdf"
 * Acknowledgement form for receiving the client handbook.
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
  // Client name in acknowledgement text
  CLIENT_NAME: 'Print First and Last Name',
  
  // Client/Legal Guardian Signature Section
  CLIENT_SIGNATURE: 'Signature30_es_:signer:signature',
  CLIENT_DATE: 'Date',
  CLIENT_PRINT_NAME: 'Print ClientLegal Guardian Name',
  
  // Mastercare Representative Section
  REP_SIGNATURE: 'Signature31_es_:signer:signature',
  REP_DATE: 'Date_2',
  REP_PRINT_NAME: 'Print Mastercare Representative Name',
};

/**
 * Auto-sync mapping - sync print name from the header field
 */
export const CLIENT_HANDBOOK_ACK_AUTO_SYNC = {
  [F.CLIENT_PRINT_NAME]: F.CLIENT_NAME,
};

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

const ClientHandbookAcknowledgementLayout = ({
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
          Client Handbook Acknowledgement
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
            value={formValues[F.CLIENT_NAME] || ''}
            onChange={handleText(F.CLIENT_NAME)}
            disabled={disabled}
            placeholder="Enter your full name"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 300 }}
          />
          <Typography variant="body1" sx={{ lineHeight: 2.5 }}>, acknowledge that I have</Typography>
        </Box>

        <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333', textAlign: 'justify' }}>
          received a copy of the Mastercare Client Handbook, which describes important information 
          about Mastercare, Inc., Notice of Privacy Practices (HIPAA), a Statement of Client's Rights 
          and Responsibilities, Grievance Reporting Procedures, Agency Contact Information, Home 
          Safety and Emergency Planning Information and Advance Directives Information. I understand 
          that I am expected to read and abide with the terms outlined in the Handbook. I also 
          understand that if I have questions concerning any of the terms of Mastercare, Inc. I should 
          contact my Service Supervisor for clarification.
        </Typography>
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

        {/* Client/Legal Guardian Signature */}
        <SignatureSection 
          title="Client/Legal Guardian Signature" 
          caption="Sign below to acknowledge receipt of the Client Handbook"
        >
          <SignaturePad
            label="Client/Legal Guardian Signature - Sign here"
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Print Client/Legal Guardian Name"
                value={formValues[F.CLIENT_PRINT_NAME] || ''}
                onChange={handleText(F.CLIENT_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter printed name"
                helperText="Full legal name"
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
                label="Print Mastercare Representative Name"
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

export default ClientHandbookAcknowledgementLayout;
