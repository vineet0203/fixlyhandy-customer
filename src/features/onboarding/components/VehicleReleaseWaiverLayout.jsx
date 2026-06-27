/**
 * VehicleReleaseWaiverLayout.jsx
 *
 * Custom form layout for "1220-Vehicle Release-Waiver_TX.pdf"
 * Vehicle Release, Waiver of Liability, and Indemnity Agreement
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
  // Client Information
  CLIENT_NAME: 'Client  Responsible Party Name',
  CAREGIVER_NAME: 'Caregiver Name',
  
  // Mastercare Office Info
  OFFICE_LOCATION: 'Address',
  PHONE_NUMBER: 'Phone Number',
  
  // Client/Legal Guardian Signature Section
  CLIENT_SIGNATURE: 'Signature93_es_:signer:signature',
  CLIENT_DATE: 'Date',
  CLIENT_PRINT_NAME: 'Print Name',
  CLIENT_RELATIONSHIP: 'Relationship',
  
  // Caregiver Signature Section
  CAREGIVER_SIGNATURE: 'Signature94_es_:signer:signature',
  CAREGIVER_DATE: 'Date_2',
  CAREGIVER_PRINT_NAME: 'Print Name_2',
  
  // Mastercare Representative Section
  REP_SIGNATURE: 'Signature95_es_:signer:signature',
  REP_DATE: 'Date_3',
  REP_PRINT_NAME: 'Print Name_3',
  REP_TITLE: 'Title',
};

/**
 * Auto-sync mapping (if needed)
 */
export const VEHICLE_RELEASE_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem', textTransform: 'uppercase' }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ mt: 0.5, color: '#666', fontSize: '0.82rem' }}>
        {subtitle}
      </Typography>
    )}
    <Divider sx={{ mt: 1 }} />
  </Box>
);

const SignatureSection = ({ title, caption, children, sx = {} }) => (
  <Box
    sx={{
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      p: 2,
      mb: 2.5,
      bgcolor: '#fafafa',
      ...sx,
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

const VehicleReleaseWaiverLayout = ({
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
          Vehicle Release, Waiver of Liability, and Indemnity Agreement
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          AGREEMENT TEXT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc' }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span">I,</Typography>
              <TextField
                size="small"
                label="Client / Responsible Party Name"
                value={formValues[F.CLIENT_NAME] || ''}
                onChange={handleText(F.CLIENT_NAME)}
                disabled={disabled}
                placeholder="Enter client's full name"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 300 }}
              />
              <Typography variant="body2" component="span">, authorize and request that</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                label="Caregiver Name"
                value={formValues[F.CAREGIVER_NAME] || ''}
                onChange={handleText(F.CAREGIVER_NAME)}
                disabled={disabled}
                placeholder="Enter caregiver's name"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 300 }}
              />
              <Typography variant="body2" component="span">
                transport the Client with the use of the Client's car or a vehicle provided by or for the Client 
                for purposes as designated within the Client's specific Care Plan.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, color: '#444' }}>
          I acknowledge that I am responsible for my automobile insurance during any times that an employee 
          of Mastercare Homecare is using my vehicle or a vehicle that I supply.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, color: '#444' }}>
          Caregivers are not authorized to transport the Client in a Caregiver's car except in extreme 
          circumstances affecting the Client's safety or welfare. If the Client chooses to be transported 
          in a Caregiver's car, then the Client assumes the risk of doing so.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, color: '#444' }}>
          A copy of the employee's driver's insurance and driver's license is on record at our Mastercare office located at:
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Mastercare Office Location"
              value={formValues[F.OFFICE_LOCATION] || ''}
              onChange={handleText(F.OFFICE_LOCATION)}
              disabled={disabled}
              placeholder="Enter office address"
              helperText="Location where records are held"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              value={formValues[F.PHONE_NUMBER] || ''}
              onChange={handleText(F.PHONE_NUMBER)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              helperText="Office contact number"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, color: '#444' }}>
          The employee has agreed to this option and will know of this release that will be held at the same location listed above.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, color: '#444', fontWeight: 500 }}>
          By signing below, I hereby waive, release, and discharge Mastercare Homecare, its owners, affiliates, 
          and employees from any and all liability, including but not limited to, liability arising from the 
          negligence or fault of the entities or persons released, for my death, disability, personal injury, 
          property damage, property theft, or actions of any kind which may hereafter occur to me during transportation.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, color: '#444', fontWeight: 500 }}>
          I, indemnify, hold harmless, and promise not to sue the entities or persons already mentioned from 
          any and all liabilities or claims made as a result of participation in this service, whether caused 
          by the negligence of release or otherwise.
        </Typography>

        <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#444', fontStyle: 'italic' }}>
          I certify that I have read this document and I fully understand its content. I am aware that this 
          is a release of liability and I sign it of my own free will.
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SIGNATURES
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader 
          title="Signatures" 
          subtitle="All parties must sign below to acknowledge and agree to the terms."
        />

        {/* Client/Legal Guardian Signature */}
        <SignatureSection 
          title="Client or Legal Guardian Signature" 
          caption="The client or their legal guardian must sign below"
        >
          <SignaturePad
            label="Client/Legal Guardian Signature - Sign here"
            value={signatureValues[F.CLIENT_SIGNATURE]}
            onChange={handleSignature(F.CLIENT_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Print Name"
                value={formValues[F.CLIENT_PRINT_NAME] || ''}
                onChange={handleText(F.CLIENT_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter printed name"
                helperText="Full legal name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Relationship"
                value={formValues[F.CLIENT_RELATIONSHIP] || ''}
                onChange={handleText(F.CLIENT_RELATIONSHIP)}
                disabled={disabled}
                placeholder="e.g., Self, Parent, Guardian"
                helperText="Relationship to client"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>

        {/* Caregiver Signature */}
        <SignatureSection 
          title="Caregiver Signature" 
          caption="The assigned caregiver must sign below"
        >
          <SignaturePad
            label="Caregiver Signature - Sign here"
            value={signatureValues[F.CAREGIVER_SIGNATURE]}
            onChange={handleSignature(F.CAREGIVER_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.CAREGIVER_DATE] || ''}
                onChange={handleText(F.CAREGIVER_DATE)}
                disabled={disabled}
                helperText="Date of signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Print Name"
                value={formValues[F.CAREGIVER_PRINT_NAME] || ''}
                onChange={handleText(F.CAREGIVER_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter caregiver's printed name"
                helperText="Caregiver's full legal name"
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                size="small"
                label="Print Name"
                value={formValues[F.REP_PRINT_NAME] || ''}
                onChange={handleText(F.REP_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter representative's printed name"
                helperText="Representative's full name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Title"
                value={formValues[F.REP_TITLE] || ''}
                onChange={handleText(F.REP_TITLE)}
                disabled={disabled}
                placeholder="e.g., Care Coordinator"
                helperText="Representative's job title"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>
      </Paper>
    </Box>
  );
};

export default VehicleReleaseWaiverLayout;
