/**
 * AutomaticPaymentLayout.jsx
 *
 * Custom form layout for "1084-Automatic Payment_TX.pdf"
 * Single page form for automatic bill payment authorization.
 * Supports both Checking/Savings Account and Credit Card payment methods.
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
  Radio,
  RadioGroup,
} from '@mui/material';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
// These match the EXACT field names from the PDF

const F = {
  // Header Authorization Info
  PRINT_FULL_NAME: 'Print Full Name',
  AMOUNT: 'Enter Amount',
  TRANSACTION_DATES: 'Enter Transaction Dates',

  // Authorization Type
  RECURRING_AUTH: 'Recurring Authorization',
  ONE_TIME_AUTH: 'One-time Authorization',

  // Checking/Savings Account Section
  CHECKING_SAVINGS_CB: 'Checking Savings Account',
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  NAME_ON_ACCOUNT: 'Name on Account',
  BANK_NAME: 'Bank Name',
  BANK_ADDRESS: 'Bank Address',
  BANK_CITY_STATE_ZIP: 'Bank City State Zip',
  ACCOUNT_NUMBER: 'Account Number',
  ROUTING_NUMBER: 'Routing Number',

  // Credit Card Section
  CREDIT_CARD_CB: 'Credit Card',
  VISA: 'Visa',
  MASTERCARD: 'MasterCard',
  AMEX: 'Amex',
  CARDHOLDER_NAME: 'Cardholder Name',
  CC_ACCOUNT_NUMBER: 'Account Number_2',
  EXPIRATION_DATE: 'Expiration Date',
  CVV: 'CVV',
  BILLING_ADDRESS: 'Billing Address',
  BILLING_CITY_STATE_ZIP: 'City State Zip',
  BILLING_PHONE: 'Phone',

  // Signature Section
  CLIENT_SIG: 'Client Signature',
  DATE: 'Date',
  PRINT_NAME: 'Print Name',
  RELATIONSHIP: 'Relationship',
};

/**
 * Auto-sync mapping for any duplicate fields
 */
export const AUTOMATIC_PAYMENT_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1.05rem' }}
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

const InfoText = ({ children }) => (
  <Typography
    variant="body2"
    sx={{ mb: 2, color: '#555', fontSize: '0.85rem', lineHeight: 1.6 }}
  >
    {children}
  </Typography>
);

// ─── Main Component ─────────────────────────────────────────────────────

const AutomaticPaymentLayout = ({
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
          Automatic Bill Payment Authorization
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          INTRODUCTION TEXT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <InfoText>
          Mastercare is pleased to offer you the option of scheduling your invoice payment to be
          automatically deducted from your bank account, or charged to your Visa, MasterCard, or
          American Express card. This way you will not have to remember when to make a payment,
          you will not have to take the time to write and mail a check, and all your payments will always
          be on time, eliminating late charges.
        </InfoText>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          AUTHORIZATION INFORMATION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader 
          title="Please complete the information below" 
          subtitle="Fill in your name, amount, and transaction dates"
        />

        <Box sx={{ mb: 3, p: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 2, fontSize: '0.9rem' }}>
            I, <strong>__________</strong> authorize Mastercare to initiate entries to my
            checking/savings/credit card accounts at the financial institution listed below in the amount of $<strong>__________</strong>
            for payment of my invoice on the <strong>__________</strong>. This authorizes the financial
            institution holding the account to post all such entries.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Your Full Legal Name"
              value={formValues[F.PRINT_FULL_NAME] || ''}
              onChange={handleText(F.PRINT_FULL_NAME)}
              disabled={disabled}
              placeholder="Enter your full name"
              helperText="Name as it appears on your account"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Payment Amount ($)"
              value={formValues[F.AMOUNT] || ''}
              onChange={handleText(F.AMOUNT)}
              disabled={disabled}
              placeholder="e.g., 500.00"
              helperText="Amount to be charged per payment"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Transaction Date(s)"
              value={formValues[F.TRANSACTION_DATES] || ''}
              onChange={handleText(F.TRANSACTION_DATES)}
              disabled={disabled}
              placeholder="e.g., 1st and 15th of each month"
              helperText="When payments should be processed"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Authorization Type */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1e3a5f' }}>
            Check One:
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!checkboxValues[F.RECURRING_AUTH]}
                  onChange={handleCheckbox(F.RECURRING_AUTH)}
                  disabled={disabled}
                  size="small"
                />
              }
              label={<Typography variant="body2">Recurring Authorization</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!checkboxValues[F.ONE_TIME_AUTH]}
                  onChange={handleCheckbox(F.ONE_TIME_AUTH)}
                  disabled={disabled}
                  size="small"
                />
              }
              label={<Typography variant="body2">One-time Authorization</Typography>}
            />
          </FormGroup>
        </Box>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          PAYMENT METHOD - TWO COLUMNS
      ═══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={3}>
        {/* ─── CHECKING / SAVINGS ACCOUNT ─── */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Checkbox
                checked={!!checkboxValues[F.CHECKING_SAVINGS_CB]}
                onChange={handleCheckbox(F.CHECKING_SAVINGS_CB)}
                disabled={disabled}
                size="small"
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem' }}>
                Checking / Savings Account
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Account Type */}
            <Box sx={{ mb: 2 }}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkboxValues[F.CHECKING]}
                      onChange={handleCheckbox(F.CHECKING)}
                      disabled={disabled}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Checking</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkboxValues[F.SAVINGS]}
                      onChange={handleCheckbox(F.SAVINGS)}
                      disabled={disabled}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Savings</Typography>}
                />
              </FormGroup>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name on Account"
                  value={formValues[F.NAME_ON_ACCOUNT] || ''}
                  onChange={handleText(F.NAME_ON_ACCOUNT)}
                  disabled={disabled}
                  placeholder="Enter account holder's name"
                  helperText="Name as it appears on the account"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bank Name"
                  value={formValues[F.BANK_NAME] || ''}
                  onChange={handleText(F.BANK_NAME)}
                  disabled={disabled}
                  placeholder="e.g., Chase Bank, Wells Fargo"
                  helperText="Name of your bank"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bank Address"
                  value={formValues[F.BANK_ADDRESS] || ''}
                  onChange={handleText(F.BANK_ADDRESS)}
                  disabled={disabled}
                  placeholder="Enter bank's street address"
                  helperText="Bank branch address"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Bank City, State, ZIP"
                  value={formValues[F.BANK_CITY_STATE_ZIP] || ''}
                  onChange={handleText(F.BANK_CITY_STATE_ZIP)}
                  disabled={disabled}
                  placeholder="e.g., Dallas, TX 75254"
                  helperText="City, state, and ZIP code"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Account Number"
                  value={formValues[F.ACCOUNT_NUMBER] || ''}
                  onChange={handleText(F.ACCOUNT_NUMBER)}
                  disabled={disabled}
                  placeholder="Enter your account number"
                  helperText="Found on your checks or bank statement"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Routing Number"
                  value={formValues[F.ROUTING_NUMBER] || ''}
                  onChange={handleText(F.ROUTING_NUMBER)}
                  disabled={disabled}
                  placeholder="9-digit routing number"
                  helperText="Found on bottom left of your check"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: '#e3f2fd', 
              borderRadius: 1,
              border: '1px solid #90caf9'
            }}>
              <Typography variant="caption" sx={{ color: '#1565c0' }}>
                📎 Please attach a voided check or savings deposit slip.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* ─── CREDIT CARD ─── */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Checkbox
                checked={!!checkboxValues[F.CREDIT_CARD_CB]}
                onChange={handleCheckbox(F.CREDIT_CARD_CB)}
                disabled={disabled}
                size="small"
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem' }}>
                Credit Card
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Card Type */}
            <Box sx={{ mb: 2 }}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkboxValues[F.VISA]}
                      onChange={handleCheckbox(F.VISA)}
                      disabled={disabled}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Visa</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkboxValues[F.MASTERCARD]}
                      onChange={handleCheckbox(F.MASTERCARD)}
                      disabled={disabled}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">MasterCard</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkboxValues[F.AMEX]}
                      onChange={handleCheckbox(F.AMEX)}
                      disabled={disabled}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Amex</Typography>}
                />
              </FormGroup>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cardholder Name"
                  value={formValues[F.CARDHOLDER_NAME] || ''}
                  onChange={handleText(F.CARDHOLDER_NAME)}
                  disabled={disabled}
                  placeholder="Name as it appears on card"
                  helperText="Exactly as printed on your card"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Card Number"
                  value={formValues[F.CC_ACCOUNT_NUMBER] || ''}
                  onChange={handleText(F.CC_ACCOUNT_NUMBER)}
                  disabled={disabled}
                  placeholder="XXXX XXXX XXXX XXXX"
                  helperText="16-digit card number"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Expiration Date"
                  value={formValues[F.EXPIRATION_DATE] || ''}
                  onChange={handleText(F.EXPIRATION_DATE)}
                  disabled={disabled}
                  placeholder="MM/YY"
                  helperText="Card expiry date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="CVV"
                  value={formValues[F.CVV] || ''}
                  onChange={handleText(F.CVV)}
                  disabled={disabled}
                  placeholder="3 or 4 digits"
                  helperText="Security code on back of card"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Billing Address"
                  value={formValues[F.BILLING_ADDRESS] || ''}
                  onChange={handleText(F.BILLING_ADDRESS)}
                  disabled={disabled}
                  placeholder="Enter billing street address"
                  helperText="Address linked to your card"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="City, State, ZIP"
                  value={formValues[F.BILLING_CITY_STATE_ZIP] || ''}
                  onChange={handleText(F.BILLING_CITY_STATE_ZIP)}
                  disabled={disabled}
                  placeholder="e.g., Dallas, TX 75254"
                  helperText="Billing city, state, and ZIP"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={formValues[F.BILLING_PHONE] || ''}
                  onChange={handleText(F.BILLING_PHONE)}
                  disabled={disabled}
                  placeholder="(XXX) XXX-XXXX"
                  helperText="Contact phone for billing"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════
          SIGNATURE SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mt: 3, mb: 3 }}>
        <SectionHeader 
          title="Client Signature" 
          subtitle="Sign below to authorize automatic payments"
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <SignaturePad
              label="Client Signature"
              value={signatureValues[F.CLIENT_SIG]}
              onChange={handleSignature(F.CLIENT_SIG)}
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
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="Print Name"
              value={formValues[F.PRINT_NAME] || ''}
              onChange={handleText(F.PRINT_NAME)}
              disabled={disabled}
              placeholder="Enter your full legal name"
              helperText="Type your full name"
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
              placeholder="e.g., Self, Parent, Spouse"
              helperText="Enter 'Self' if you are the client"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          TERMS AND CONDITIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666', mb: 1.5 }}>
          This authorization will remain in effect until I cancel it in writing, and I agree to notify Mastercare, in writing of any changes in my account
          information or termination of this authorization at least 30 days prior to the next billing date. If the above noted payment dates fall on a
          weekend or holiday, I understand that the payments may be executed on the next business day.
        </Typography>
        
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666', mb: 1.5 }}>
          <strong>For ACH debits to my checking/savings account</strong>, I understand that because these are electronic transactions, these funds may be
          withdrawn from my account as soon as the invoice period transaction dates. In the case of an ACH Transaction being rejected for Non-
          Sufficient Funds (NSF), I understand that Mastercare, will charge me a service fee for each attempt returned NSF which will be initiated as a
          separate transaction from the authorized automatic bill payment. A receipt for each payment will be mailed to me.
        </Typography>
        
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
          <strong>For credit card payments</strong>, I understand my credit card will be charged the balance due with a 3.5% handling fee during the first week of each
          month and upon termination of services.
        </Typography>
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
          1084/MC-Rev.1025 | ©Mastercare All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default AutomaticPaymentLayout;
