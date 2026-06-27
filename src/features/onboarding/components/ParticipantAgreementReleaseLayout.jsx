/**
 * ParticipantAgreementReleaseLayout.jsx
 *
 * Custom form layout for "325-Participant Agreement Release_TX.pdf"
 * Agreement release form for homecare program participants.
 */
import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Print Name in acknowledgement
  PRINT_NAME: 'Print Name',
  
  // Client Signature Section
  CLIENT_SIGNATURE: 'Signature28_es_:signer:signature',
  CLIENT_DATE: 'Date',
};

/**
 * Auto-sync mapping
 */
export const PARTICIPANT_AGREEMENT_RELEASE_AUTO_SYNC = {};

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

const ParticipantAgreementReleaseLayout = ({
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
          Participant Agreement Release
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          WARNING
      ═══════════════════════════════════════════════════════════════════ */}
      <Alert 
        severity="warning" 
        icon={<WarningAmberIcon />}
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          '& .MuiAlert-message': { 
            fontSize: '1rem',
            textAlign: 'center',
            width: '100%'
          }
        }}
      >
        ***READ BEFORE SIGNING***
      </Alert>

      {/* ═══════════════════════════════════════════════════════════════════
          AGREEMENT TEXT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.8, color: '#333' }}>
          In consideration of the Homecare program that I am participating in with Mastercare Homecare, 
          I understand, it is never the intent of any of the caregivers who work in my home to harm, 
          destruct, or in any way damage client belongings, their homes, or personal property. I further 
          understand that it is common that during the process of the Activities of Daily Living and 
          caring for our clients in their homes:
        </Typography>

        <Box component="ol" sx={{ pl: 3, mb: 2.5 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
            Items in my home may be unintentionally broken.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
            Items in my home may be unintentionally misplaced.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
            Caregivers will be using my cleaning products such as dish soap, laundry detergent, furniture 
            polish, window cleaners etc., and it is my responsibility to replace those items as they are 
            used by the caregiver to care for myself and my home.
          </Typography>
          <Typography component="li" variant="body2" sx={{ lineHeight: 1.7 }}>
            Caregivers will be using my household equipment i.e., vacuum cleaner, all kitchenware, appliances, 
            and kitchen products, washing machine and dryer
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.8, color: '#333' }}>
          I, hereby release, indemnify, and hold harmless <em>Mastercare Homecare</em>, its owners, officers, 
          officials, employees, and if applicable, agents or sponsors that may conduct business for myself 
          in my home, from any and all claims, demands, losses, and liability arising out of any damage to 
          my personal property, use of my personal property whether negligent or not, in the execution of 
          the aforementioned duties.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.8, color: '#333' }}>
          I understand that if I observe any unusual or significant misuse, mistreatment, or intentional 
          destruction of any of my personal property during care or treatment by any representative or 
          caregiver of Mastercare Homecare, that it is my responsibility to notify Mastercare Homecare, 
          within 24 hours. I further understand that I have the right to file a grievance to obtain a 
          resolution to the reported issue and failure to do so may result in an investigation that yields 
          an inability to validate the claim.
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          ACKNOWLEDGEMENT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            label="Print Name"
            value={formValues[F.PRINT_NAME] || ''}
            onChange={handleText(F.PRINT_NAME)}
            disabled={disabled}
            placeholder="Enter your full name"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 300 }}
          />
          <Typography variant="body2">
            acknowledges that he/she has read and understands this agreement and voluntarily accepts 
            the obligations of the Participant Agreement Release.
          </Typography>
        </Box>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SIGNATURE
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem', textTransform: 'uppercase', mb: 1 }}
        >
          Client Signature
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <SignatureSection 
          title="Client Signature" 
          caption="Sign below to acknowledge and accept the terms of this agreement"
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
      </Paper>
    </Box>
  );
};

export default ParticipantAgreementReleaseLayout;
