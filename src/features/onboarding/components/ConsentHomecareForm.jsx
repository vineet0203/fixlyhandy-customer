// features/onboarding/components/ConsentHomecareForm.jsx
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
} from '@mui/material';
import SignaturePad from './SignaturePad';

/**
 * "Consent for Homecare Service & Client Agreement" form.
 * 2-page form rendered as sections.
 */
const ConsentHomecareForm = ({ formData, onChange, signatures, onSignatureChange, disabled = false }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...formData, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  };

  const handleSignature = (field) => (dataUrl) => {
    onSignatureChange({ ...signatures, [field]: dataUrl });
  };

  return (
    <Box>
      {/* ───────── PAGE 1: Consent for Homecare Service ───────── */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
          Page 1 — Consent for Homecare Service
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Client Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.clientName || ''}
              onChange={handleChange('clientName')}
              disabled={disabled}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address || ''}
              onChange={handleChange('address')}
              disabled={disabled}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber || ''}
              onChange={handleChange('phoneNumber')}
              disabled={disabled}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={handleChange('dateOfBirth')}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              value={formData.emergencyContact || ''}
              onChange={handleChange('emergencyContact')}
              disabled={disabled}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Phone"
              value={formData.emergencyPhone || ''}
              onChange={handleChange('emergencyPhone')}
              disabled={disabled}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Consent Acknowledgements
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.consentPersonalCare}
                onChange={handleChange('consentPersonalCare')}
                disabled={disabled}
              />
            }
            label="I consent to receive personal care services as outlined in my service plan."
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.consentMedication}
                onChange={handleChange('consentMedication')}
                disabled={disabled}
              />
            }
            label="I consent to medication reminders / administration as applicable."
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.consentEmergency}
                onChange={handleChange('consentEmergency')}
                disabled={disabled}
              />
            }
            label="I consent to emergency procedures if necessary for my safety."
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.consentPrivacy}
                onChange={handleChange('consentPrivacy')}
                disabled={disabled}
              />
            }
            label="I acknowledge I have read and understand the privacy policy."
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Initials"
            value={formData.consentInitials || ''}
            onChange={handleChange('consentInitials')}
            disabled={disabled}
            size="small"
            placeholder="Enter your initials"
            sx={{ maxWidth: 200 }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Signatures
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SignaturePad
                label="Client Signature"
                onChange={handleSignature('clientSignature')}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date"
                type="date"
                value={formData.signatureDate || ''}
                onChange={handleChange('signatureDate')}
                InputLabelProps={{ shrink: true }}
                disabled={disabled}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Witness Name"
                value={formData.witnessName || ''}
                onChange={handleChange('witnessName')}
                disabled={disabled}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SignaturePad
                label="Witness Signature"
                onChange={handleSignature('witnessSignature')}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* ───────── PAGE 2: Client Agreement ───────── */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2 }}>
          Page 2 — Client Agreement
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Client Name"
              value={formData.agreementClientName || ''}
              onChange={handleChange('agreementClientName')}
              disabled={disabled}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Plan Details"
              value={formData.servicePlan || ''}
              onChange={handleChange('servicePlan')}
              disabled={disabled}
              size="small"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange('startDate')}
              InputLabelProps={{ shrink: true }}
              disabled={disabled}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rate Per Hour ($)"
              type="number"
              value={formData.ratePerHour || ''}
              onChange={handleChange('ratePerHour')}
              disabled={disabled}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Hours Per Week"
              type="number"
              value={formData.hoursPerWeek || ''}
              onChange={handleChange('hoursPerWeek')}
              disabled={disabled}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Agreement Signatures
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SignaturePad
                label="Client Signature"
                onChange={handleSignature('clientSignaturePage2')}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date"
                type="date"
                value={formData.datePage2 || ''}
                onChange={handleChange('datePage2')}
                InputLabelProps={{ shrink: true }}
                disabled={disabled}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Representative Name"
                value={formData.representativeName || ''}
                onChange={handleChange('representativeName')}
                disabled={disabled}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SignaturePad
                label="Representative Signature"
                onChange={handleSignature('repSignature')}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConsentHomecareForm;
