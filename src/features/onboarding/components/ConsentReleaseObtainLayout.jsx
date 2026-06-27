/**
 * ConsentReleaseObtainLayout.jsx
 *
 * Custom form layout for "1081-Consent to Release-Obtain Information_TX.pdf"
 * Renders form fields matching the actual PDF document structure.
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
  FormGroup,
  Paper,
} from '@mui/material';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
// These should match the EXACT field names in the PDF template

const F = {
  // Client Info
  CLIENT_NAME: 'Client Name',
  DOB: 'DOB',

  // Section 1 - Authorization type
  RELEASE: 'Release',
  OBTAIN: 'Obtain',

  // Section 1 - Information types
  ENTIRE_MEDICAL_RECORDS: 'Entire Medical Records',
  MENTAL_HEALTH_INITIALS: 'Mental Health Records',
  ALCOHOL_DRUG_INITIALS: 'Alcohol Drug Treatment',
  COMMUNICABLE_DISEASES_INITIALS: 'Communicable Diseases',
  MEDICAL_RECORDS_FROM: 'Medical Records from',
  MEDICAL_RECORDS_FROM_TEXT: 'Medical Records from Text',
  ALL_PAST_PRESENT_FUTURE: 'All past present future',
  OTHER_CB: 'Other',
  OTHER_TEXT: 'Other Text',

  // Section 2 - Persons/Agency/Organization
  PERSON_A: 'Person A',
  PERSON_B: 'Person B',
  PERSON_C: 'Person C',
  PERSON_D: 'Person D',

  // Signature Section
  SIGNATURE: 'Signature of Person Giving Consent',
  DATE: 'Date',
  PRINT_NAME: 'Print Name of Person Giving Consent',
  RELATIONSHIP: 'Relationship',
};

/**
 * Auto-sync mapping for this form (if any fields need to be synced)
 */
export const CONSENT_RELEASE_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ number, title, subtitle }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1.05rem' }}
    >
      {number ? `${number}. ${title}` : title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ mt: 0.5, color: '#666', fontSize: '0.82rem' }}>
        {subtitle}
      </Typography>
    )}
    <Divider sx={{ mt: 1 }} />
  </Box>
);

const InfoText = ({ children }) => (
  <Typography
    variant="body2"
    sx={{
      color: '#444',
      fontSize: '0.85rem',
      lineHeight: 1.6,
      mb: 2,
      textAlign: 'justify',
    }}
  >
    {children}
  </Typography>
);

// ─── Main Component ─────────────────────────────────────────────────────

const ConsentReleaseObtainLayout = ({
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

  // ── Reusable TextField renderer ──
  const TF = ({ name, label, grid = {}, multiline, rows, type = 'text', placeholder }) => (
    <Grid item xs={12} sm={6} {...grid}>
      <TextField
        fullWidth
        size="small"
        label={label}
        type={type}
        value={formValues[name] || ''}
        onChange={handleText(name)}
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
      />
    </Grid>
  );

  // ── Reusable Checkbox renderer ──
  const CB = ({ name, label }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={!!checkboxValues[name]}
          onChange={handleCheckbox(name)}
          disabled={disabled}
          size="small"
        />
      }
      label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{label}</Typography>}
    />
  );

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER - Mastercare Branding
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: '#1e3a5f', mb: 0.5 }}
        >
          mastercare
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Homecare & Healthcare
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: '#00539B', fontSize: '1.1rem' }}
        >
          Consent To Release / Obtain Information
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CLIENT INFORMATION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Client Information" />
        
        <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '0.85rem' }}>
          Please enter the client's information. If you are the client, enter your own information below.
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Client's Full Legal Name"
              value={formValues[F.CLIENT_NAME] || ''}
              onChange={handleText(F.CLIENT_NAME)}
              disabled={disabled}
              required
              placeholder="Enter client's full name (First Middle Last)"
              helperText="The person whose information will be released/obtained"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Date of Birth"
              type="date"
              value={formValues[F.DOB] || ''}
              onChange={handleText(F.DOB)}
              disabled={disabled}
              helperText="Client's birth date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          HIPAA DISCLOSURE TEXT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <InfoText>
          I understand that, under the Health Insurance Portability & Accountability Act of 1996 (HIPAA), I have
          certain rights to privacy regarding my protected health information (PHI). I understand that this
          information can and will be used to:
        </InfoText>

        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
            • Conduct, plan and direct my treatment and follow-up among providers who may be involved in
            that treatment directly and indirectly.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
            • Obtain payment from third-party payers.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            • Conduct normal agency operations like quality reviews.
          </Typography>
        </Box>

        <InfoText>
          I have been given the right to review Mastercare's <em>Notice of Privacy Practices</em> prior to signing this
          consent. I understand that Mastercare has the right to change its <em>Notice of Privacy Practice</em> from time to
          time and that I may contact Mastercare at any time and obtain a current copy of the <em>Notice of Privacy
          Practices</em>.
        </InfoText>

        <InfoText>
          I understand that I have the right to request a restriction of how my protected health information is used.
          I also understand that Mastercare is not required to agree to this request. If Mastercare agrees to my
          requested restrictions, they must follow those restrictions.
        </InfoText>

        <InfoText>
          I understand that I may revoke this consent at any time, by making a request in writing, except for
          information already used or disclosed.
        </InfoText>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 - AUTHORIZATION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader number="1" title="I authorize Mastercare to" />

        {/* Release / Obtain checkboxes */}
        <Box sx={{ mb: 3 }}>
          <FormGroup row>
            <CB name={F.RELEASE} label="Release" />
            <CB name={F.OBTAIN} label="Obtain" />
          </FormGroup>
          <Typography variant="body2" sx={{ mt: 1, color: '#444', fontSize: '0.85rem' }}>
            the following information about me:
          </Typography>
        </Box>

        {/* Information Types */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#fafafa', mb: 2 }}>
          <FormGroup>
            <CB
              name={F.ENTIRE_MEDICAL_RECORDS}
              label="Entire Medical Records, including billing records, insurance records, records from other health care providers, and the following information if selected below:"
            />
          </FormGroup>

          {/* Initialing sub-section */}
          <Box sx={{ pl: 4, mt: 1.5, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem', color: '#1e3a5f' }}>
              Include: <em>(Initial next to each type of record you authorize to release)</em>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mental Health Records"
                  value={formValues[F.MENTAL_HEALTH_INITIALS] || ''}
                  onChange={handleText(F.MENTAL_HEALTH_INITIALS)}
                  disabled={disabled}
                  placeholder="Your initials (e.g., JS)"
                  helperText="Initial here to authorize"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Alcohol / Drug Treatment"
                  value={formValues[F.ALCOHOL_DRUG_INITIALS] || ''}
                  onChange={handleText(F.ALCOHOL_DRUG_INITIALS)}
                  disabled={disabled}
                  placeholder="Your initials (e.g., JS)"
                  helperText="Initial here to authorize"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Communicable Diseases (HIV & AIDS)"
                  value={formValues[F.COMMUNICABLE_DISEASES_INITIALS] || ''}
                  onChange={handleText(F.COMMUNICABLE_DISEASES_INITIALS)}
                  disabled={disabled}
                  placeholder="Your initials (e.g., JS)"
                  helperText="Initial here to authorize"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Medical Records From */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!checkboxValues[F.MEDICAL_RECORDS_FROM]}
                  onChange={handleCheckbox(F.MEDICAL_RECORDS_FROM)}
                  disabled={disabled}
                  size="small"
                />
              }
              label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Medical Records from</Typography>}
            />
            <TextField
              size="small"
              value={formValues[F.MEDICAL_RECORDS_FROM_TEXT] || ''}
              onChange={handleText(F.MEDICAL_RECORDS_FROM_TEXT)}
              disabled={disabled || !checkboxValues[F.MEDICAL_RECORDS_FROM]}
              placeholder="Enter hospital/clinic/doctor name"
              sx={{ flex: 1 }}
            />
          </Box>

          {/* All past, present, future */}
          <FormGroup>
            <CB
              name={F.ALL_PAST_PRESENT_FUTURE}
              label="All past, present, and future periods of health care information may be shared."
            />
          </FormGroup>

          {/* Other */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!checkboxValues[F.OTHER_CB]}
                  onChange={handleCheckbox(F.OTHER_CB)}
                  disabled={disabled}
                  size="small"
                />
              }
              label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Other:</Typography>}
            />
            <TextField
              size="small"
              value={formValues[F.OTHER_TEXT] || ''}
              onChange={handleText(F.OTHER_TEXT)}
              disabled={disabled || !checkboxValues[F.OTHER_CB]}
              placeholder="Specify any other information type"
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 - PERSONS/AGENCY/ORGANIZATION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader
          number="2"
          title="This information may be released from/to the following persons/agency/organization:"
        />
        
        <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '0.85rem' }}>
          Enter the name of person, agency, or organization to share information with:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="a. Person/Agency/Organization Name"
              value={formValues[F.PERSON_A] || ''}
              onChange={handleText(F.PERSON_A)}
              disabled={disabled}
              placeholder="e.g., Dr. John Smith, ABC Hospital, Insurance Company"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="b. Person/Agency/Organization Name"
              value={formValues[F.PERSON_B] || ''}
              onChange={handleText(F.PERSON_B)}
              disabled={disabled}
              placeholder="e.g., Family Member Name, Pharmacy Name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="c. Person/Agency/Organization Name"
              value={formValues[F.PERSON_C] || ''}
              onChange={handleText(F.PERSON_C)}
              disabled={disabled}
              placeholder="Optional - Add another if needed"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="d. Person/Agency/Organization Name"
              value={formValues[F.PERSON_D] || ''}
              onChange={handleText(F.PERSON_D)}
              disabled={disabled}
              placeholder="Optional - Add another if needed"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SIGNATURE SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Signatures" />
        
        <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '0.85rem' }}>
          Please sign below to authorize the release/obtaining of your information.
        </Typography>

        <Grid container spacing={3}>
          {/* Row 1: Signature + Date */}
          <Grid item xs={12} md={8}>
            <SignaturePad
              label="Signature of Person Giving Consent"
              value={signatureValues[F.SIGNATURE]}
              onChange={handleSignature(F.SIGNATURE)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Date of Signature"
              type="date"
              value={formValues[F.DATE] || ''}
              onChange={handleText(F.DATE)}
              disabled={disabled}
              helperText="Today's date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Row 2: Print Name + Relationship */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="Print Name of Person Giving Consent"
              value={formValues[F.PRINT_NAME] || ''}
              onChange={handleText(F.PRINT_NAME)}
              disabled={disabled}
              placeholder="Enter your full legal name"
              helperText="Type your full name as it appears on your ID"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Relationship to Client"
              value={formValues[F.RELATIONSHIP] || ''}
              onChange={handleText(F.RELATIONSHIP)}
              disabled={disabled}
              placeholder="e.g., Self, Parent, Spouse, Guardian"
              helperText="Your relationship (enter 'Self' if you are the client)"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ textAlign: 'center', py: 2, color: '#888' }}>
        <Typography variant="caption" sx={{ display: 'block' }}>
          7920 Belt Line Road, Suite 720, Dallas TX 75254 | Phone: 972-777-4345 | Fax: 469-930-6430
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          Email: support@mastercare.care | www.mastercare.care
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
          1081/MC-Rev.1025 | ©Mastercare All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default ConsentReleaseObtainLayout;
