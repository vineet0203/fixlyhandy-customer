/**
 * AssignmentBenefitsLayout.jsx
 *
 * Custom form layout for "Assignment of Benefits" PDF
 * Single page form for assignment of long-term care insurance benefits.
 */
import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Paper,
  FormGroup,
} from '@mui/material';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Client Information
  CLIENT_FIRST_NAME: 'First Name',
  CLIENT_LAST_NAME: 'Last Name',
  CLIENT_DOB: 'DOB',
  CLIENT_ADDRESS_1: 'Address',
  CLIENT_ADDRESS_2: 'Address_2',
  CLIENT_ADDRESS_3: 'Address_3',
  CLIENT_PHONE: 'Phone Number',
  CLIENT_PAYS_FOR: 'Client Pays For',

  // Long Term Care/Insurance Information
  INSURANCE_CARRIER: 'Insurance Carrier',
  TRIWEST: 'TriWest',
  VA_REFERRAL: 'VA Referral',
  INSURANCE_ADDRESS: 'Insurance Address',
  INSURANCE_PHONE: 'Insurance Phone Number',
  POLICY_NUMBER: 'Policy Number',
  CLAIM_NUMBER: 'Claim Number',
  INSURANCE_PAYS_FOR: 'Insurance Pays For',

  // Client Signature Section
  CLIENT_SIG: 'Client Signature',
  CLIENT_SIG_DATE: 'Date',
  CLIENT_PRINT_NAME: 'Print Name',
  CLIENT_RELATIONSHIP: 'Relationship',

  // Mastercare Representative Section
  MASTERCARE_SIG: 'Mastercare Signature',
  MASTERCARE_SIG_DATE: 'Date_2',
  MASTERCARE_PRINT_NAME: 'Print Name_2',
};

/**
 * Auto-sync mapping for duplicate fields
 */
export const ASSIGNMENT_BENEFITS_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem', textDecoration: 'underline' }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ mt: 0.5, color: '#666', fontSize: '0.82rem' }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const InfoText = ({ title, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.9rem' }}>
      {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: '#333', fontSize: '0.8rem', lineHeight: 1.6, textAlign: 'justify' }}
    >
      {children}
    </Typography>
  </Box>
);

// ─── Main Component ─────────────────────────────────────────────────────

const AssignmentBenefitsLayout = ({
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

  const handleCheckbox = (fieldName) => (e) => {
    onCheckboxChange({ ...checkboxValues, [fieldName]: e.target.checked });
  };

  const handleSignature = (fieldName) => (dataUrl) => {
    onSignatureChange({ ...signatureValues, [fieldName]: dataUrl });
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER - Mastercare Branding
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}
        >
          Assignment of Benefits
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CLIENT INFORMATION & INSURANCE INFORMATION - TWO COLUMNS
      ═══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* ─── CLIENT INFORMATION ─── */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <SectionHeader title="Client Information" />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  value={formValues[F.CLIENT_FIRST_NAME] || ''}
                  onChange={handleText(F.CLIENT_FIRST_NAME)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  value={formValues[F.CLIENT_LAST_NAME] || ''}
                  onChange={handleText(F.CLIENT_LAST_NAME)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="DOB"
                  type="date"
                  value={formValues[F.CLIENT_DOB] || ''}
                  onChange={handleText(F.CLIENT_DOB)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Address Line 1"
                  value={formValues[F.CLIENT_ADDRESS_1] || ''}
                  onChange={handleText(F.CLIENT_ADDRESS_1)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Address Line 2"
                  value={formValues[F.CLIENT_ADDRESS_2] || ''}
                  onChange={handleText(F.CLIENT_ADDRESS_2)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Address Line 3"
                  value={formValues[F.CLIENT_ADDRESS_3] || ''}
                  onChange={handleText(F.CLIENT_ADDRESS_3)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={formValues[F.CLIENT_PHONE] || ''}
                  onChange={handleText(F.CLIENT_PHONE)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Client Pays For (%)"
                  value={formValues[F.CLIENT_PAYS_FOR] || ''}
                  onChange={handleText(F.CLIENT_PAYS_FOR)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                  placeholder="%"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* ─── LONG TERM CARE / INSURANCE INFORMATION ─── */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <SectionHeader title="Long Term Care/Insurance Information" />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Insurance Carrier"
                  value={formValues[F.INSURANCE_CARRIER] || ''}
                  onChange={handleText(F.INSURANCE_CARRIER)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!checkboxValues[F.TRIWEST]}
                        onChange={handleCheckbox(F.TRIWEST)}
                        disabled={disabled}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">TriWest</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!checkboxValues[F.VA_REFERRAL]}
                        onChange={handleCheckbox(F.VA_REFERRAL)}
                        disabled={disabled}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">VA Referral</Typography>}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  value={formValues[F.INSURANCE_ADDRESS] || ''}
                  onChange={handleText(F.INSURANCE_ADDRESS)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={formValues[F.INSURANCE_PHONE] || ''}
                  onChange={handleText(F.INSURANCE_PHONE)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Policy Number"
                  value={formValues[F.POLICY_NUMBER] || ''}
                  onChange={handleText(F.POLICY_NUMBER)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Claim Number"
                  value={formValues[F.CLAIM_NUMBER] || ''}
                  onChange={handleText(F.CLAIM_NUMBER)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Insurance Pays For (%)"
                  value={formValues[F.INSURANCE_PAYS_FOR] || ''}
                  onChange={handleText(F.INSURANCE_PAYS_FOR)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                  placeholder="%"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════
          POLICY INFORMATION SECTIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc' }}>
        <InfoText title="Long-Term Care Insurance">
          I understand that Mastercare only accepts assignment of certain select Long-Term Care Insurance
          Policies. I have been advised that Mastercare will not initiate a claim with my Long-Term Care Insurer.
          Moreover, I understand that Mastercare does not accept assignment of Medicaid benefits. Acceptance of the
          Assignment of Benefits by Mastercare and the receipt of any pre-approval or pre-certification from an
          insurance company is not a guaranty of payment. Payment for services rendered by Mastercare is due at the
          time an invoice is rendered as set forth in the Client Service Agreement.
        </InfoText>

        <InfoText title="Assignment of Benefits">
          I hereby assign all Long-Term Care benefits to which I am entitled to Mastercare and I direct my insurance carrier(s)
          to issue payment check(s) directly to Mastercare. I understand that I am responsible for any amount not covered
          by insurance.
        </InfoText>

        <InfoText title="Authorization to Release Information">
          I hereby authorize Mastercare to: (a) release any information necessary to insurance carriers regarding my illness
          and treatments; (b) process insurance claims generated in the course of services rendered; and (c) allow a
          photocopy of my signature to be used to process insurance claims for the period of the lifetime of the Client Service
          Agreement. I authorize my insurance carrier(s) to release any insurance related information to Mastercare as may
          be necessary to process such claims. This order will remain in effect until revoked by me in writing.
        </InfoText>

        <InfoText title="Financial Responsibility">
          I have requested homecare and/or home health services form Mastercare and understand that by making this
          request, I become fully financially responsible for any and all charges incurred in the course of the treatment
          authorized or services rendered. I further understand that fees are due and payable as set forth in the Client
          Service Agreement and agree to pay such charges incurred in full immediately upon presentation of an invoice. A
          copy of this assignment is to be considered as valid as the original.
        </InfoText>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CLIENT SIGNATURE SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2, fontSize: '1rem' }}>
          Client / Legal Representative Signature
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Signature of Client or Legal Representative
            </Typography>
            <SignaturePad
              value={signatureValues[F.CLIENT_SIG]}
              onChange={handleSignature(F.CLIENT_SIG)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              value={formValues[F.CLIENT_SIG_DATE] || ''}
              onChange={handleText(F.CLIENT_SIG_DATE)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="Print Name of Client or Legal Representative"
              value={formValues[F.CLIENT_PRINT_NAME] || ''}
              onChange={handleText(F.CLIENT_PRINT_NAME)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Relationship"
              value={formValues[F.CLIENT_RELATIONSHIP] || ''}
              onChange={handleText(F.CLIENT_RELATIONSHIP)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
            If you sign this form on behalf of the Client, you must attach a copy of the Power of Attorney or Court
            Order appointing you Client's legal guardian.
          </Typography>
        </Box>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          MASTERCARE REPRESENTATIVE SIGNATURE SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2, fontSize: '1rem' }}>
          Mastercare Representative Signature
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Signature of Mastercare Representative
            </Typography>
            <SignaturePad
              value={signatureValues[F.MASTERCARE_SIG]}
              onChange={handleSignature(F.MASTERCARE_SIG)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              value={formValues[F.MASTERCARE_SIG_DATE] || ''}
              onChange={handleText(F.MASTERCARE_SIG_DATE)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="Print Name of Mastercare Representative"
              value={formValues[F.MASTERCARE_PRINT_NAME] || ''}
              onChange={handleText(F.MASTERCARE_PRINT_NAME)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 2, bgcolor: '#1e3a5f', color: '#fff' }}>
        <Grid container spacing={2} sx={{ fontSize: '0.75rem' }}>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" display="block">
              7920 Belt Line Road, Suite 720, Dallas TX 75254
            </Typography>
            <Typography variant="caption" display="block">
              100/MC-Rev.1025
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" display="block">
              Phone: 972-777-4345 | Fax: 469-930-6430
            </Typography>
            <Typography variant="caption" display="block">
              ©Mastercare All Rights Reserved
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" display="block">
              Email: support@mastercare.care
            </Typography>
            <Typography variant="caption" display="block">
              www.mastercare.care
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AssignmentBenefitsLayout;
