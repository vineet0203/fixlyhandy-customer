/**
 * ConsentHomecareLayout.jsx
 *
 * Custom form layout for "1009-Consent for Homecare Services & Client Agreement_TX.pdf"
 * Renders form fields grouped into sections matching the actual PDF document structure.
 *
 * The PDF has 48 fields across 2 pages. Some 8×8 PDFTextFields act as visual checkboxes
 * in the payment options section — we render them as checkboxes in the UI and store 'X'/''.
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
// These match the EXACT field names extracted from the PDF via pdf-lib.

const F = {
  // Page 1 — Client Info
  CLIENT_NAME: 'Client Name',
  DOB: 'DOB',

  // Page 1 — Services (real PDFCheckBox fields)
  CHORE: 'Chore',
  PA: 'PA',
  CNA: 'CNA',
  COMPANION: 'Companion',
  RESPITE: 'Respite',
  RN: 'RN',
  LPN: 'LPN',

  // Page 1 — Frequency
  FREQUENCY: 'Frequency by Discipline',

  // Page 1 — Billing Cycle (real PDFCheckBox fields)
  WEEKLY: 'Weekly',
  BI_WEEKLY: 'BiWeekly',
  MONTHLY: 'Monthly',

  // Page 1 — Payment Options
  //   The checkboxes below are actually 8×8 PDFTextField in the PDF.
  //   We render them as UI checkboxes and store 'X' or '' in formValues.
  PAY_INSURANCE_CB: 'andor other Insurance Billing Cycle',
  PAY_INSURANCE_AMT: 'at',
  PAY_PRIVATE_CB: 'undefined',
  PAY_PRIVATE_AMT: 'are based on type and frequency of service Charges are',
  PAY_OTHER_CB: 'undefined_2',
  PAY_OTHER_AMT: 'Other sources of payment',
  PAY_DEPOSIT_CB: 'undefined_3',
  PAY_DEPOSIT_HRS: '2 Week Deposit based on',
  PAY_DEPOSIT_AMT: 'hrs',

  // Page 2 — Client Info (auto-synced from page 1, hidden in UI)
  CLIENT_NAME_P2: 'IV Rights and Responsibility of Client',
  DOB_P2: 'DOB_2',

  // Page 2 — Advance Directive Verification (real PDFCheckBox fields)
  AD_NO_DIRECTIVE: 'I do not have an Advanced Directive',
  AD_HAS_DIRECTIVE: 'I have an Advance Directive',
  AD_GIVE_COPY: 'I will give a copy to Mastercare',
  AD_NAME_CB: 'Name',
  AD_HAS_REP: 'Yes I have a Health Care Representative or Medical Power of Attorney',

  // Page 2 — Advance Directive text fields
  AD_NAME_TEXT: 'has a copy of my Advanced Directive',
  AD_RELATIONSHIP: 'Relationship',
  AD_REP_NAME: 'I understand that in the absence of an Advance Directive and a physicians Do Not Resuscitate Order Mastercare will',
  AD_REP_PHONE: 'Phone',

  // Page 2 — Client Signature row
  CLIENT_SIG: 'Signature99_es_:signer:signature',
  CLIENT_PHONE: 'Phone Number',
  CLIENT_DATE: 'Date',
  CLIENT_WITNESS: 'Witness',

  // Page 2 — Representative Signature row
  REP_SIG: 'Signature100_es_:signer:signature',
  REP_DATE: 'Date_2',
  REP_WITNESS: 'Witness_2',

  // Page 2 — Secondary Guarantor
  SEC_NAME: 'Secondary Guarantor  Name',
  SEC_PHONE: 'Phone Number_2',
  SEC_DATE: 'Date_3',
  SEC_WITNESS: 'Witness_3',

  // Page 2 — Tertiary Guarantor
  TER_NAME: 'Tertiary Guarantor  Name',
  TER_PHONE: 'Phone Number_3',
  TER_DATE: 'Date_4',
  TER_WITNESS: 'Witness_4',
};

/**
 * Auto-sync mapping: page-2 fields that should copy from page-1 fields.
 * Applied before fillPdfForm is called.
 */
export const CONSENT_AUTO_SYNC = {
  [F.CLIENT_NAME_P2]: F.CLIENT_NAME,
  [F.DOB_P2]: F.DOB,
};

/**
 * List of fake-checkbox field names (8×8 PDFTextField acting as checkboxes).
 * These are stored in formValues as 'X' or '' (not in checkboxValues).
 */
export const CONSENT_FAKE_CHECKBOXES = [
  F.PAY_INSURANCE_CB,
  F.PAY_PRIVATE_CB,
  F.PAY_OTHER_CB,
  F.PAY_DEPOSIT_CB,
];

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

const CheckboxGroup = ({ label, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#444', mb: 0.5, fontSize: '0.85rem' }}>
      {label}
    </Typography>
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        p: 1.5,
        bgcolor: '#fafafa',
      }}
    >
      <FormGroup row>{children}</FormGroup>
    </Box>
  </Box>
);

const SubSection = ({ title, caption, children, sx = {} }) => (
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

const ConsentHomecareLayout = ({
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

  // Fake checkboxes (8×8 text fields) → store as 'X' or '' in formValues
  const handleFakeCheckbox = (fieldName) => (e) => {
    onFormChange({ ...formValues, [fieldName]: e.target.checked ? 'X' : '' });
  };
  const isFakeChecked = (fieldName) =>
    formValues[fieldName] === 'X' || formValues[fieldName] === 'x';

  const handleSignature = (fieldName) => (dataUrl) => {
    onSignatureChange({ ...signatureValues, [fieldName]: dataUrl });
  };

  // ── Reusable renderers ──
  const TF = ({ name, label, grid = {}, multiline, rows, type = 'text' }) => (
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
      />
    </Grid>
  );

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
      label={<Typography variant="body2">{label}</Typography>}
    />
  );

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ═══════ CLIENT INFORMATION ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Client Information" />
        <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '0.85rem' }}>
          Please enter the client's full legal name and date of birth.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Client's Full Legal Name"
              value={formValues[F.CLIENT_NAME] || ''}
              onChange={handleText(F.CLIENT_NAME)}
              disabled={disabled}
              placeholder="Enter client's full name (First Middle Last)"
              helperText="The person receiving homecare services"
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

      {/* ═══════ I. CONSENT FOR SERVICES (info only) ═══════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
          I. Consent for Services and Release of Information
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#555', fontSize: '0.82rem' }}>
          By completing this form you consent to home care services as documented in your Plan of Care
          and authorize the release of information as described in the agreement.
        </Typography>
      </Paper>

      {/* ═══════ II. PAYMENT FOR SERVICES RENDERED ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader
          number="II"
          title="Payment for Services Rendered"
          subtitle="Select the services you agree to receive and indicate your payment method."
        />

        {/* Services — Non-Medical */}
        <CheckboxGroup label="Services — Non-Medical">
          <CB name={F.CHORE} label="Chore" />
          <CB name={F.PA} label="PA" />
          <CB name={F.CNA} label="CNA" />
          <CB name={F.COMPANION} label="Companion" />
          <CB name={F.RESPITE} label="Respite" />
        </CheckboxGroup>

        {/* Private Duty Nursing */}
        <CheckboxGroup label="Private Duty Nursing">
          <CB name={F.RN} label="RN" />
          <CB name={F.LPN} label="LPN" />
        </CheckboxGroup>

        {/* Frequency by Discipline */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Frequency by Discipline"
              value={formValues[F.FREQUENCY] || ''}
              onChange={handleText(F.FREQUENCY)}
              disabled={disabled}
              placeholder="e.g., 3x/week for 4 hours, Daily AM & PM visits"
              helperText="Describe how often each type of service will be provided"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Billing Cycle */}
        <CheckboxGroup label="Billing Cycle">
          <CB name={F.WEEKLY} label="Weekly" />
          <CB name={F.BI_WEEKLY} label="Bi-Weekly" />
          <CB name={F.MONTHLY} label="Monthly" />
        </CheckboxGroup>

        {/* Payment Options */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#444', mb: 0.5, fontSize: '0.85rem' }}>
          Payment Options
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#fafafa' }}>
          {/* Option 1 — Private Medical Insurance */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Checkbox
              checked={isFakeChecked(F.PAY_INSURANCE_CB)}
              onChange={handleFakeCheckbox(F.PAY_INSURANCE_CB)}
              disabled={disabled}
              size="small"
              sx={{ mt: -0.5, mr: 0.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.75, lineHeight: 1.5 }}>
                Private Medical Insurance, Managed Care Company, or other Third-Party Payor or Long
                Term Care will pay Mastercare for Homecare services provided, with a co-payment or
                deductible from me estimated at:
              </Typography>
              <TextField
                size="small"
                label="Estimated Co-pay/Deductible Amount"
                value={formValues[F.PAY_INSURANCE_AMT] || ''}
                onChange={handleText(F.PAY_INSURANCE_AMT)}
                disabled={disabled}
                placeholder="$ Amount"
                helperText="Your estimated out-of-pocket cost"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 250 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Option 2 — Private Pay */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Checkbox
              checked={isFakeChecked(F.PAY_PRIVATE_CB)}
              onChange={handleFakeCheckbox(F.PAY_PRIVATE_CB)}
              disabled={disabled}
              size="small"
              sx={{ mt: -0.5, mr: 0.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.75, lineHeight: 1.5 }}>
                Private Pay: I am responsible for the total amount due to Mastercare for services
                rendered to me. Charges are based on type and frequency of service.
              </Typography>
              <TextField
                size="small"
                label="Service Charges"
                value={formValues[F.PAY_PRIVATE_AMT] || ''}
                onChange={handleText(F.PAY_PRIVATE_AMT)}
                disabled={disabled}
                placeholder="$ Amount per service"
                helperText="Charges based on service type and frequency"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 250 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Option 3 — Other sources */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Checkbox
              checked={isFakeChecked(F.PAY_OTHER_CB)}
              onChange={handleFakeCheckbox(F.PAY_OTHER_CB)}
              disabled={disabled}
              size="small"
              sx={{ mt: -0.5, mr: 0.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.75 }}>
                Other sources of payment:
              </Typography>
              <TextField
                size="small"
                label="Other Payment Source Amount"
                value={formValues[F.PAY_OTHER_AMT] || ''}
                onChange={handleText(F.PAY_OTHER_AMT)}
                disabled={disabled}
                placeholder="$ Amount"
                helperText="e.g., Grant, VA benefits, etc."
                InputLabelProps={{ shrink: true }}
                sx={{ width: 250 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Option 4 — 2 Week Deposit */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Checkbox
              checked={isFakeChecked(F.PAY_DEPOSIT_CB)}
              onChange={handleFakeCheckbox(F.PAY_DEPOSIT_CB)}
              disabled={disabled}
              size="small"
              sx={{ mt: -0.5, mr: 0.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.75 }}>
                2 Week Deposit based on:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  label="Hours per Week"
                  value={formValues[F.PAY_DEPOSIT_HRS] || ''}
                  onChange={handleText(F.PAY_DEPOSIT_HRS)}
                  disabled={disabled}
                  placeholder="e.g., 20 hrs"
                  helperText="Weekly service hours"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 180 }}
                />
                <TextField
                  size="small"
                  label="Deposit Amount"
                  value={formValues[F.PAY_DEPOSIT_AMT] || ''}
                  onChange={handleText(F.PAY_DEPOSIT_AMT)}
                  disabled={disabled}
                  placeholder="$ Amount"
                  helperText="2-week deposit amount"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 180 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ═══════ III. RECEIPT OF PRIVACY NOTICE (info only) ═══════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
          III. Receipt of Privacy Notice
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#555', fontSize: '0.82rem' }}>
          You acknowledge receipt of the Mastercare Consent to Release Information which included a
          Privacy Notice per HIPAA regulations concerning the privacy of your records.
        </Typography>
      </Paper>

      {/* ═══════ IV & V (info only) ═══════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
          IV. Rights and Responsibility of Client
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#555', fontSize: '0.82rem', mb: 2 }}>
          You understand your rights and responsibilities as a Mastercare client as explained during
          orientation.
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
          V. Assignment of Insurance Benefits
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#555', fontSize: '0.82rem' }}>
          All benefits payable under any insurance policy for services rendered by Mastercare are
          hereby assigned to Mastercare directly.
        </Typography>
      </Paper>

      {/* ═══════ VI. ADVANCE DIRECTIVE VERIFICATION ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader
          number="VI"
          title="Advance Directive Verification"
          subtitle="Provide information about your Advance Directive status."
        />

        {/* Top row of checkboxes */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.AD_NO_DIRECTIVE]}
                onChange={handleCheckbox(F.AD_NO_DIRECTIVE)}
                disabled={disabled}
              />
            }
            label={<Typography variant="body2">I do not have an Advanced Directive</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.AD_HAS_DIRECTIVE]}
                onChange={handleCheckbox(F.AD_HAS_DIRECTIVE)}
                disabled={disabled}
              />
            }
            label={<Typography variant="body2">I have an Advance Directive</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.AD_GIVE_COPY]}
                onChange={handleCheckbox(F.AD_GIVE_COPY)}
                disabled={disabled}
              />
            }
            label={<Typography variant="body2">I will give a copy to Mastercare</Typography>}
          />
        </Box>

        {/* Name has a copy + Relationship */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 0.5 }}>
          <Checkbox
            checked={!!checkboxValues[F.AD_NAME_CB]}
            onChange={handleCheckbox(F.AD_NAME_CB)}
            disabled={disabled}
            sx={{ mt: 0.5 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#555' }}>
              (Name) has a copy of my Advanced Directive:
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Person's Name Who Has Copy"
                  value={formValues[F.AD_NAME_TEXT] || ''}
                  onChange={handleText(F.AD_NAME_TEXT)}
                  disabled={disabled}
                  placeholder="Enter full name of person holding your directive"
                  helperText="Who has a copy of your Advance Directive?"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Their Relationship to You"
                  value={formValues[F.AD_RELATIONSHIP] || ''}
                  onChange={handleText(F.AD_RELATIONSHIP)}
                  disabled={disabled}
                  placeholder="e.g., Spouse, Child, Attorney, Doctor"
                  helperText="Their relationship to the client"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Health Care Representative */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.AD_HAS_REP]}
                onChange={handleCheckbox(F.AD_HAS_REP)}
                disabled={disabled}
              />
            }
            label={
              <Typography variant="body2">
                Yes, I have a Health Care Representative or Medical Power of Attorney
              </Typography>
            }
          />
          <Grid container spacing={1.5} sx={{ pl: 4.5, mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Healthcare Representative / POA Name"
                value={formValues[F.AD_REP_NAME] || ''}
                onChange={handleText(F.AD_REP_NAME)}
                disabled={disabled}
                placeholder="Enter representative's full legal name"
                helperText="Person authorized to make medical decisions"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Representative's Phone Number"
                value={formValues[F.AD_REP_PHONE] || ''}
                onChange={handleText(F.AD_REP_PHONE)}
                disabled={disabled}
                placeholder="(XXX) XXX-XXXX"
                helperText="Contact number for your representative"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* ═══════ VII. GUARANTEE OF PAYMENT & SIGNATURES ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader
          number="VII"
          title="Guarantee of Payment & Signatures"
          subtitle="Please sign below and provide witness information."
        />

        {/* Client Signature */}
        <SubSection title="Client Signature" caption="The client or person receiving services must sign below">
          <SignaturePad
            label="Client's Signature - Sign here"
            value={signatureValues[F.CLIENT_SIG]}
            onChange={handleSignature(F.CLIENT_SIG)}
            disabled={disabled}
          />
          <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Client's Phone Number"
                value={formValues[F.CLIENT_PHONE] || ''}
                onChange={handleText(F.CLIENT_PHONE)}
                disabled={disabled}
                placeholder="(XXX) XXX-XXXX"
                helperText="Your contact phone number"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date of Signature"
                value={formValues[F.CLIENT_DATE] || ''}
                onChange={handleText(F.CLIENT_DATE)}
                disabled={disabled}
                helperText="Today's date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Witness Name"
                value={formValues[F.CLIENT_WITNESS] || ''}
                onChange={handleText(F.CLIENT_WITNESS)}
                disabled={disabled}
                placeholder="Enter witness's full name"
                helperText="Person witnessing this signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SubSection>

        {/* Representative Signature */}
        <SubSection
          title="Representative Signature"
          caption="Required ONLY if client is unable to sign. Include reason why client cannot sign."
        >
          <SignaturePad
            label="Representative's Signature - Sign if client cannot"
            value={signatureValues[F.REP_SIG]}
            onChange={handleSignature(F.REP_SIG)}
            disabled={disabled}
          />
          <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date of Signature"
                value={formValues[F.REP_DATE] || ''}
                onChange={handleText(F.REP_DATE)}
                disabled={disabled}
                helperText="Today's date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Witness Name"
                value={formValues[F.REP_WITNESS] || ''}
                onChange={handleText(F.REP_WITNESS)}
                disabled={disabled}
                placeholder="Enter witness's full name"
                helperText="Person witnessing this signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SubSection>

        {/* Secondary Guarantor */}
        <SubSection title="Secondary Guarantor" caption="Person who guarantees payment if client does not pay">
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Guarantor's Full Name"
                value={formValues[F.SEC_NAME] || ''}
                onChange={handleText(F.SEC_NAME)}
                disabled={disabled}
                placeholder="Enter guarantor's name"
                helperText="Person guaranteeing payment"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Guarantor's Phone"
                value={formValues[F.SEC_PHONE] || ''}
                onChange={handleText(F.SEC_PHONE)}
                disabled={disabled}
                placeholder="(XXX) XXX-XXXX"
                helperText="Contact number"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.SEC_DATE] || ''}
                onChange={handleText(F.SEC_DATE)}
                disabled={disabled}
                helperText="Today's date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Witness Name"
                value={formValues[F.SEC_WITNESS] || ''}
                onChange={handleText(F.SEC_WITNESS)}
                disabled={disabled}
                placeholder="Witness name"
                helperText="Person witnessing"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SubSection>

        {/* Tertiary Guarantor */}
        <SubSection title="Tertiary Guarantor" caption="Additional backup guarantor (optional)" sx={{ mb: 0 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Guarantor's Full Name"
                value={formValues[F.TER_NAME] || ''}
                onChange={handleText(F.TER_NAME)}
                disabled={disabled}
                placeholder="Enter guarantor's name"
                helperText="Third guarantor (if needed)"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Guarantor's Phone"
                value={formValues[F.TER_PHONE] || ''}
                onChange={handleText(F.TER_PHONE)}
                disabled={disabled}
                placeholder="(XXX) XXX-XXXX"
                helperText="Contact number"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.TER_DATE] || ''}
                onChange={handleText(F.TER_DATE)}
                disabled={disabled}
                helperText="Today's date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Witness Name"
                value={formValues[F.TER_WITNESS] || ''}
                onChange={handleText(F.TER_WITNESS)}
                disabled={disabled}
                placeholder="Witness name"
                helperText="Person witnessing"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SubSection>
      </Paper>
    </Box>
  );
};

export default ConsentHomecareLayout;
