/**
 * EmergencyPlanLayout.jsx
 *
 * Custom form layout for "7000-Emergency Plan_TX.pdf"
 * Emergency planning form with contacts, local numbers, and priority classification.
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
  Alert,
} from '@mui/material';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Header
  DATE: 'Date',
  REASSESSMENT_DATE: 'Reassessment Date',
  CLIENT_NAME: 'Client Name',
  DOB: 'DOB',

  // Section 1: Emergencies
  ADDRESS: 'Address',
  PHONE: 'Phone',
  CELL: 'Cell',
  MAJOR_CROSSROADS: 'Major Crossroads',
  EMERGENCY_CONTACT: 'Emergency Contact',
  EMERGENCY_PHONE: 'EC Phone',
  EMERGENCY_RELATIONSHIP: 'Relationship',
  EMERGENCY_CELL: 'EC Cell',

  // Section 2: Local Numbers
  PHYSICIAN_1: 'Physician',
  PHYSICIAN_1_PHONE: 'Dr Phone',
  PHYSICIAN_2: 'Physician 2',
  PHYSICIAN_2_PHONE: 'Physician 2 Phone',
  PHYSICIAN_3: 'Physician 3',
  PHYSICIAN_3_PHONE: 'Physician 3 Phone',
  HOSPITAL: 'Hospital',
  HOSPITAL_PHONE: 'Hospital Phone',
  PHARMACY: 'Pharmacy',
  PHARMACY_PHONE: 'Pharmacy Phone',

  // Section 4: Temporary Relocation Site
  RELOCATION_NAME: 'Temp Relocation',
  RELOCATION_PHONE: 'Relocation Phone',

  // Section 5: Utilities
  ELECTRIC_COMPANY: 'Utilities: Electric',
  GAS_COMPANY: 'Utilities: Gas',

  // Section 6: Priority Classification
  PRIORITY_1: '1 High Priority  Uninterrupted Service',
  PRIORITY_2: '2 Moderate Priority  Phone Call Required',
  PRIORITY_3: '3 Low Priority Stable  Can Miss a Visit',
  PRIORITY_4: '4 Lowest Priority  May Be Postponed for 3 Days',

  // Signatures
  CLIENT_SIGNATURE: 'Signature122_es_:signer:signature',
  CLIENT_PRINT_NAME: 'Client Print Name',
  CLIENT_DATE: 'Client Date',
  REP_SIGNATURE: 'Rep Signature',
  REP_PRINT_NAME: 'Rep Print Name',
  REP_DATE: 'Rep Date',
};

/**
 * Auto-sync mapping
 */
export const EMERGENCY_PLAN_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ number, title }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: 700, color: '#1e3a5f', fontSize: '0.95rem' }}
    >
      {number}. {title}
    </Typography>
    <Divider />
  </Box>
);

const SignatureSection = ({ title, caption, children }) => (
  <Box
    sx={{
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      p: 2,
      mb: 2,
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

const EmergencyPlanLayout = ({
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
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}>
          Emergency Plan
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          DATE & CLIENT INFO
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date"
              value={formValues[F.DATE] || ''}
              onChange={handleText(F.DATE)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Reassessment Date"
              value={formValues[F.REASSESSMENT_DATE] || ''}
              onChange={handleText(F.REASSESSMENT_DATE)}
              disabled={disabled}
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
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
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: EMERGENCIES - CALL 911
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader number="1" title="Emergencies – Call 911" />
        <Typography variant="caption" sx={{ color: '#c62828', display: 'block', mb: 2, fontStyle: 'italic' }}>
          Tell them the number you are calling from.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Address"
              value={formValues[F.ADDRESS] || ''}
              onChange={handleText(F.ADDRESS)}
              disabled={disabled}
              placeholder="Enter full address"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.PHONE] || ''}
              onChange={handleText(F.PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Cell"
              value={formValues[F.CELL] || ''}
              onChange={handleText(F.CELL)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Major Crossroads"
              value={formValues[F.MAJOR_CROSSROADS] || ''}
              onChange={handleText(F.MAJOR_CROSSROADS)}
              disabled={disabled}
              placeholder="Nearest major intersection"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#c62828', mb: 1 }}>
              Emergency Contact
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Emergency Contact Name"
              value={formValues[F.EMERGENCY_CONTACT] || ''}
              onChange={handleText(F.EMERGENCY_CONTACT)}
              disabled={disabled}
              placeholder="Contact's full name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.EMERGENCY_PHONE] || ''}
              onChange={handleText(F.EMERGENCY_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Relationship"
              value={formValues[F.EMERGENCY_RELATIONSHIP] || ''}
              onChange={handleText(F.EMERGENCY_RELATIONSHIP)}
              disabled={disabled}
              placeholder="e.g., Spouse, Son, Daughter"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Cell"
              value={formValues[F.EMERGENCY_CELL] || ''}
              onChange={handleText(F.EMERGENCY_CELL)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: LOCAL NUMBERS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader number="2" title="Local Numbers" />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Physician"
              value={formValues[F.PHYSICIAN_1] || ''}
              onChange={handleText(F.PHYSICIAN_1)}
              disabled={disabled}
              placeholder="Primary physician name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.PHYSICIAN_1_PHONE] || ''}
              onChange={handleText(F.PHYSICIAN_1_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Physician 2"
              value={formValues[F.PHYSICIAN_2] || ''}
              onChange={handleText(F.PHYSICIAN_2)}
              disabled={disabled}
              placeholder="Secondary physician (optional)"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.PHYSICIAN_2_PHONE] || ''}
              onChange={handleText(F.PHYSICIAN_2_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Physician 3"
              value={formValues[F.PHYSICIAN_3] || ''}
              onChange={handleText(F.PHYSICIAN_3)}
              disabled={disabled}
              placeholder="Specialist (optional)"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.PHYSICIAN_3_PHONE] || ''}
              onChange={handleText(F.PHYSICIAN_3_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Hospital"
              value={formValues[F.HOSPITAL] || ''}
              onChange={handleText(F.HOSPITAL)}
              disabled={disabled}
              placeholder="Preferred hospital name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.HOSPITAL_PHONE] || ''}
              onChange={handleText(F.HOSPITAL_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Pharmacy"
              value={formValues[F.PHARMACY] || ''}
              onChange={handleText(F.PHARMACY)}
              disabled={disabled}
              placeholder="Pharmacy name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.PHARMACY_PHONE] || ''}
              onChange={handleText(F.PHARMACY_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Pre-filled numbers */}
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Police/Fire/Paramedics: <span style={{ color: '#c62828' }}>911</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Poison Control: <span style={{ color: '#1e3a5f' }}>1-800-222-1222</span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Suicide Hotline: <span style={{ color: '#1e3a5f' }}>1-800-273-8255</span>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: EVACUATION PLAN
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <SectionHeader number="3" title="Evacuation Plan" />
        <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
          As per Civil Defense and Red Cross Protocols
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: TEMPORARY RELOCATION SITE
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader number="4" title="Temporary Relocation Site" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              value={formValues[F.RELOCATION_NAME] || ''}
              onChange={handleText(F.RELOCATION_NAME)}
              disabled={disabled}
              placeholder="Relocation site name or contact"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.RELOCATION_PHONE] || ''}
              onChange={handleText(F.RELOCATION_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: UTILITIES
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader number="5" title="Utilities" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Electric Company"
              value={formValues[F.ELECTRIC_COMPANY] || ''}
              onChange={handleText(F.ELECTRIC_COMPANY)}
              disabled={disabled}
              placeholder="Electric provider"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Gas Company"
              value={formValues[F.GAS_COMPANY] || ''}
              onChange={handleText(F.GAS_COMPANY)}
              disabled={disabled}
              placeholder="Gas provider"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: PRIORITY CLASSIFICATION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader number="6" title="Priority Classification" />
        
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.PRIORITY_1]}
                onChange={handleCheckbox(F.PRIORITY_1)}
                disabled={disabled}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                1: High Priority = Uninterrupted Service
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.PRIORITY_2]}
                onChange={handleCheckbox(F.PRIORITY_2)}
                disabled={disabled}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                2: Moderate Priority = Phone Call Required
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.PRIORITY_3]}
                onChange={handleCheckbox(F.PRIORITY_3)}
                disabled={disabled}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                3: Low Priority Stable = Can Miss a Visit
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checkboxValues[F.PRIORITY_4]}
                onChange={handleCheckbox(F.PRIORITY_4)}
                disabled={disabled}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                4: Lowest Priority = May Be Postponed for 3 Days
              </Typography>
            }
          />
        </Box>

        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.8rem', lineHeight: 1.6 }}>
            <strong>LEVEL 1 – High Priority:</strong> Patients in this priority level need uninterrupted services. 
            The patient must have care. In case of a disaster or emergency, every possible effort must be made to 
            see the patient. The patient's condition is highly unstable and deterioration or inpatient admission is 
            highly probable if the patient is not seen. Examples include patients requiring life sustaining equipment 
            or medication, those needing highly skilled wound care, and unstable patients with no caregiver or informal 
            support to provide care.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.8rem', lineHeight: 1.6 }}>
            <strong>LEVEL 2 – Moderate Priority:</strong> Services for patients at this priority level may be postponed 
            with telephone contact. A caregiver can provide basic care until the emergency situation improves. The 
            patient's condition is somewhat unstable and requires care that should be provided that day but could be 
            postponed without harm to the patient.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.8rem', lineHeight: 1.6 }}>
            <strong>LEVEL 3 – Low Priority:</strong> The patient may be stable and has access to informal resources to 
            help them. The patient can safely miss a scheduled visit with basic care provided safely by family or other 
            informal support or by the patient personally.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
            <strong>Level 4 – Lowest Priority:</strong> Visits may be postponed 72 hours or more with little or no 
            adverse effects. Willing and able caregiver available or patient is independent in most ADLs.
          </Typography>
        </Box>
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

        {/* Client Signature */}
        <SignatureSection title="Client Signature" caption="Sign below to acknowledge the emergency plan">
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
                label="Print Name"
                value={formValues[F.CLIENT_PRINT_NAME] || ''}
                onChange={handleText(F.CLIENT_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter printed name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.CLIENT_DATE] || ''}
                onChange={handleText(F.CLIENT_DATE)}
                disabled={disabled}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>

        {/* Mastercare Representative Signature */}
        <SignatureSection title="Mastercare Representative" caption="To be completed by Mastercare representative">
          <SignaturePad
            label="Representative Signature - Sign here"
            value={signatureValues[F.REP_SIGNATURE]}
            onChange={handleSignature(F.REP_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Print Name"
                value={formValues[F.REP_PRINT_NAME] || ''}
                onChange={handleText(F.REP_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter printed name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.REP_DATE] || ''}
                onChange={handleText(F.REP_DATE)}
                disabled={disabled}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER NOTE
      ═══════════════════════════════════════════════════════════════════ */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          **Mastercare Staff will not make home visits during times of emergency or disaster.
        </Typography>
      </Alert>
    </Box>
  );
};

export default EmergencyPlanLayout;
