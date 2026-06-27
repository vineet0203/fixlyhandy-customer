/**
 * PhysicalAssessmentLayout.jsx
 *
 * Custom form layout for "110-Physical Assessment-Info_TX.pdf"
 * 3-page comprehensive health assessment form.
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
// Page 1 - Client Info, Contacts, Vitals, Diagnosis, Medications, Allergies

const F = {
  // ══════ PAGE 1 ══════
  // Client Information
  CLIENT_NAME: 'Client Name',
  DATE: 'Date',
  DOB: 'DOB',
  CODE_STATUS: 'Code Status',
  SEX_MALE: 'Male',
  SEX_FEMALE: 'Female',
  ADDRESS: 'Address',
  PHONE: 'Phone',
  CELL_PHONE: 'Cell Phone',

  // Emergency Contact
  EMERGENCY_CONTACT: 'Emergency Contact',
  EMERGENCY_PHONE: 'Phone_2',
  EMERGENCY_RELATIONSHIP: 'Relationship',

  // Primary Caregiver
  PRIMARY_CAREGIVER: 'Primary Caregiver',
  CAREGIVER_PHONE: 'Phone_3',
  CAREGIVER_RELATIONSHIP: 'Relationship_2',

  // Primary Care Physician
  PRIMARY_PHYSICIAN: 'Primary Care Physician',
  PHYSICIAN_PHONE: 'Phone_4',
  PHYSICIAN_ADDRESS: 'Address_2',

  // Pharmacy
  PHARMACY: 'Pharmacy',
  PHARMACY_PHONE: 'Phone_5',
  PHARMACY_ADDRESS: 'Address_3',

  // Source Information
  SOURCE_CLIENT: 'Client',
  SOURCE_FAMILY: 'Family',
  SOURCE_OTHER: 'Other',
  SOURCE_OTHER_TEXT: 'Other_text',

  // Vitals
  TEMPERATURE: 'Temperature',
  BP: 'BP',
  HR: 'HR',
  RESPIRATIONS: 'Respirations',
  O2SAT: 'O2sat',

  // Special Diet
  SPECIAL_DIET: 'Special Diet',

  // Client Diagnosis (1-10)
  DIAGNOSIS_1: 'Diagnosis 1',
  DIAGNOSIS_2: 'Diagnosis 2',
  DIAGNOSIS_3: 'Diagnosis 3',
  DIAGNOSIS_4: 'Diagnosis 4',
  DIAGNOSIS_5: 'Diagnosis 5',
  DIAGNOSIS_6: 'Diagnosis 6',
  DIAGNOSIS_7: 'Diagnosis 7',
  DIAGNOSIS_8: 'Diagnosis 8',
  DIAGNOSIS_9: 'Diagnosis 9',
  DIAGNOSIS_10: 'Diagnosis 10',

  // Current Medications (1-10)
  MED_1: 'Med 1',
  MED_2: 'Med 2',
  MED_3: 'Med 3',
  MED_4: 'Med 4',
  MED_5: 'Med 5',
  MED_6: 'Med 6',
  MED_7: 'Med 7',
  MED_8: 'Med 8',
  MED_9: 'Med 9',
  MED_10: 'Med 10',

  // Allergic Reactions
  ALLERGIC_YES: 'Allergic Yes',
  ALLERGIC_NO: 'Allergic No',
  ALLERGY_1: 'Allergy 1',
  ALLERGY_2: 'Allergy 2',
  ALLERGY_3: 'Allergy 3',
  REACTION_1: 'Reaction 1',
  REACTION_2: 'Reaction 2',
  REACTION_3: 'Reaction 3',

  // Additional Info question
  ADDITIONAL_INFO_YES: 'Additional Info Yes',
  ADDITIONAL_INFO_NO: 'Additional Info No',
  ADDITIONAL_INFO_DESC: 'Additional Info Description',

  // ══════ PAGE 2 ══════
  // NEURO
  NEURO_ALERT_ORIENTED: 'Alert and oriented',
  NEURO_CONFUSED: 'Confused at times',
  NEURO_DISORIENTED: 'Disoriented',
  NEURO_COMATOSE: 'Comatose',
  NEURO_OTHER: 'Neuro Other',
  NEURO_OTHER_TEXT: 'Neuro Other Text',
  NEURO_PERRLA: 'PERRLA',
  NEURO_MOVES_ALL: 'Moves all extremities without problems',
  NEURO_PARALYSIS: 'Paralysis',
  NEURO_WEAKNESS: 'Weakness',
  NEURO_WEAKNESS_SIDE: 'Weakness Side',
  NEURO_ABNORMAL_GAIT: 'Abnormal gait',
  NEURO_PAIN: 'Pain',
  NEURO_PAIN_LEVEL: 'Pain Level',

  // SKIN
  SKIN_WARM_DRY: 'Warm and dry',
  SKIN_COOL: 'Cool',
  SKIN_MOIST: 'Moist',
  SKIN_EDEMA: 'Peripheral edema',
  SKIN_EDEMA_WHERE: 'Edema Where',
  SKIN_PRESSURE_ULCER: 'Pressure Ulcer',
  SKIN_WOUNDS: 'Wounds',
  SKIN_RASH: 'Rash',
  SKIN_COLOR_NORMAL: 'Color Normal',
  SKIN_COLOR_FLUSHED: 'Flushed',
  SKIN_COLOR_PALE: 'Pale',
  SKIN_COLOR_CYANOTIC: 'Cyanotic',
  SKIN_COLOR_JAUNDICE: 'Jaundice',

  // CARDIOVASCULAR
  CV_HR_REGULAR: 'HR regular',
  CV_HR_IRREGULAR: 'HR irregular',
  CV_PACEMAKER: 'Pacemaker',
  CV_HYPERTENSION: 'Hypertension',
  CV_CARDIAC_HISTORY: 'History of cardiac problems',

  // GASTROINTESTINAL
  GI_NO_PROBLEMS: 'GI No history of problems',
  GI_CONSTIPATION: 'Constipation',
  GI_DIARRHEA: 'Diarrhea',
  GI_NG_TUBE: 'NG tube',
  GI_G_TUBE: 'G-Tube',
  GI_TPN: 'TPN',
  GI_ABDOMEN_SOFT: 'Abdomen soft nontender',
  GI_ABDOMEN_FIRM: 'Abdomen firm nondistended',

  // GENITOURINARY
  GU_NO_PROBLEMS: 'GU No history of problems',
  GU_INCONTINENT_URINE: 'Incontinent of urine',
  GU_FOLEY: 'Foley catheter',
  GU_OTHER: 'GU Other',
  GU_OTHER_TEXT: 'GU Other Text',
  GU_CONTINENT: 'Continent',
  GU_INCONTINENT: 'Incontinent',
  GU_TENDERNESS: 'Tenderness present',
  GU_BOWEL_OTHER: 'Bowel Other',
  GU_BOWEL_OTHER_TEXT: 'Bowel Other Text',

  // RESPIRATORY
  RESP_REGULAR: 'Respirations regular and unlabored lungs clear',
  RESP_SOB: 'SOB',
  RESP_ABNORMAL_BREATH: 'Abnormal breath sounds',
  RESP_ABNORMAL_BREATH_TEXT: 'Abnormal breath sounds text',
  RESP_USES_O2: 'Uses O2 at',
  RESP_USES_O2_RATE: 'O2 Rate',
  RESP_COUGH: 'Cough',
  RESP_DYSPNEA: 'Dyspnea',
  RESP_COPD: 'COPD',
  RESP_SMOKER: 'Smoker',

  // ENDOCRINE
  ENDO_NO_PROBLEMS: 'Endo No history of problems',
  ENDO_DIABETES: 'Diabetes',
  ENDO_INSULIN: 'Insulin dependent',
  ENDO_PO_MED: 'Antidiabetic PO medication',
  ENDO_DIET_CONTROLLED: 'Diet controlled',
  ENDO_THYROID: 'Thyroid disease',
  ENDO_THYROID_TEXT: 'Thyroid disease text',
  ENDO_OTHER: 'Endo Other',
  ENDO_OTHER_TEXT: 'Endo Other Text',

  // MUSCULOSKELETAL
  MSK_NO_PROBLEMS: 'MSK No problems',
  MSK_ARTHRITIS: 'Arthritis',
  MSK_FRACTURE: 'Fracture',
  MSK_SPINAL_CORD: 'Spinal Cord Injury',
  MSK_OTHER: 'MSK Other',
  MSK_OTHER_TEXT: 'MSK Other Text',

  // PSYCHOLOGICAL
  PSYCH_CALM: 'Calm',
  PSYCH_AGITATED: 'Agitated',
  PSYCH_FLAT: 'Flat affect',
  PSYCH_ANXIOUS: 'Anxious',
  PSYCH_DEPRESSED: 'Depressed',
  PSYCH_OTHER: 'Psych Other',
  PSYCH_OTHER_TEXT: 'Psych Other Text',

  // MEDICAL HISTORY
  HOSPITAL_ADMISSIONS: 'Hospital Admissions within 5 years',
  SURGERIES: 'Surgeries',
  ONGOING_PROBLEMS: 'On-going Medical Problems',

  // ══════ PAGE 3 ══════
  // EATING
  EATING_INDEPENDENT_PREP: 'Independent in food preparation and eating',
  EATING_INDEPENDENT: 'Independent in eating',
  EATING_SUPERVISION: 'Can prepare and eat meals with supervision',
  EATING_ASSISTANCE: 'Requires assistance with eating requires preparation of meals',
  EATING_TOTAL_ASSISTANCE: 'Needs meals prepared and total assistance with eating',
  EATING_G_TUBE: 'Receives G-tube feeding TPN',

  // BATHING
  BATHING_INDEPENDENT: 'Bathing Independent',
  BATHING_MINIMAL: 'Needs supervision minimal assistance',
  BATHING_SUBSTANTIAL: 'Requires substantial amount of assistance',
  BATHING_TOTAL: 'Needs to be bathed or showered unable to assist',

  // TOILETING
  TOILET_INDEPENDENT: 'Toileting Independent',
  TOILET_SUPERVISION: 'Needs some supervision in using bathroom',
  TOILET_SUBSTANTIAL: 'Needs substantial assistance in using bathroom personal',
  TOILET_HYGIENE: 'Hygiene',
  TOILET_UNABLE: 'Unable to use bathroom uses diapers or briefs',

  // DRESSING
  DRESS_INDEPENDENT: 'Independent can dress self',
  DRESS_SUPERVISION: 'Dressing Needs supervision',
  DRESS_ASSISTANCE: 'Dressing Requires assistance',
  DRESS_TOTAL: 'Needs to be dressed',

  // WALKING / AMBULATION
  WALK_INDEPENDENT: 'Walks independently',
  WALK_WITH_ASSISTANCE: 'Can walk with anothers assistance',
  WALK_DEVICE: 'Needs device to ambulate',
  WALK_DEVICE_TEXT: 'Device Text',
  WALK_WHEELCHAIR: 'Uses wheelchair cannot ambulate',
  WALK_WEIGHT_BEAR: 'Can weight bear for transfers',
  WALK_HOYER: 'Hoyer',

  // EQUIPMENT
  EQUIP_CANE: 'Cane',
  EQUIP_WALKER: 'Walker',
  EQUIP_WHEELCHAIR: 'Wheelchair',
  EQUIP_GLASSES: 'Glasses',
  EQUIP_CONTACTS: 'Contact lenses',
  EQUIP_HEARING_AID: 'Hearing aid',
  EQUIP_DENTURES_UPPER: 'Dentures Upper Partials',
  EQUIP_DENTURES_LOWER: 'Dentures Lower Partials',
  EQUIP_PROSTHESIS: 'Prosthesis',
  EQUIP_SHOWER_CHAIR: 'Shower Chair',
  EQUIP_OTHER: 'Equip Other',
  EQUIP_OTHER_TEXT: 'Equip Other Text',

  // SOCIAL
  PRIMARY_LANGUAGE: 'Primary Language',
  EDUCATION_LEVEL: 'Highest Level of Schooling',
  FORMER_OCCUPATION: 'Former Occupation',
  HOBBIES: 'Hobbies and Interests',
  LIVES_ALONE: 'Alone',
  LIVES_SIGNIFICANT_OTHER: 'With significant others',
  LIVES_FAMILY: 'With family',
  LIVES_OTHER: 'Lives Other',
  LIVES_OTHER_TEXT: 'Lives Other Text',

  // ASSESSOR'S SIGNATURE
  ASSESSOR_SIG: 'Signature',
  ASSESSOR_DATE: 'Assessor Date',
  ASSESSOR_PRINT_NAME: 'Assessor Print Name',
};

/**
 * Auto-sync mapping
 */
export const PHYSICAL_ASSESSMENT_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, color = '#1e3a5f' }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color, fontSize: '1rem', textTransform: 'uppercase' }}
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

const CheckboxSection = ({ title, children, bgcolor = '#f8fafc' }) => (
  <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor }}>
    <Typography 
      variant="subtitle2" 
      sx={{ 
        fontWeight: 700, 
        color: '#fff', 
        bgcolor: '#1e3a5f', 
        px: 1, 
        py: 0.5, 
        mb: 1.5,
        fontSize: '0.85rem'
      }}
    >
      {title}
    </Typography>
    {children}
  </Paper>
);

const CB = ({ name, label, checked, onChange, disabled }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={!!checked}
        onChange={onChange}
        disabled={disabled}
        size="small"
      />
    }
    label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{label}</Typography>}
    sx={{ mr: 1, mb: 0.5 }}
  />
);

// ─── Main Component ─────────────────────────────────────────────────────

const PhysicalAssessmentLayout = ({
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
          Physical Assessment & Information
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE 1 - CLIENT INFORMATION
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Client Information" />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Client Name"
              value={formValues[F.CLIENT_NAME] || ''}
              onChange={handleText(F.CLIENT_NAME)}
              disabled={disabled}
              placeholder="Enter client's full name"
              helperText="Client's full legal name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              value={formValues[F.DATE] || ''}
              onChange={handleText(F.DATE)}
              disabled={disabled}
              helperText="Assessment date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Code Status"
              value={formValues[F.CODE_STATUS] || ''}
              onChange={handleText(F.CODE_STATUS)}
              disabled={disabled}
              placeholder="e.g., Full Code, DNR"
              helperText="Client's code status"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Sex:</Typography>
              <FormGroup row>
                <CB name={F.SEX_MALE} label="Male" checked={checkboxValues[F.SEX_MALE]} onChange={handleCheckbox(F.SEX_MALE)} disabled={disabled} />
                <CB name={F.SEX_FEMALE} label="Female" checked={checkboxValues[F.SEX_FEMALE]} onChange={handleCheckbox(F.SEX_FEMALE)} disabled={disabled} />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Address"
              value={formValues[F.ADDRESS] || ''}
              onChange={handleText(F.ADDRESS)}
              disabled={disabled}
              placeholder="Enter full address"
              helperText="Client's current residence"
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
              helperText="Home phone"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Cell Phone"
              value={formValues[F.CELL_PHONE] || ''}
              onChange={handleText(F.CELL_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              helperText="Mobile number"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ CONTACTS ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Contacts" />
        
        {/* Emergency Contact */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#c62828' }}>
          Emergency Contact
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Emergency Contact Name"
              value={formValues[F.EMERGENCY_CONTACT] || ''}
              onChange={handleText(F.EMERGENCY_CONTACT)}
              disabled={disabled}
              placeholder="Enter contact name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Relationship"
              value={formValues[F.EMERGENCY_RELATIONSHIP] || ''}
              onChange={handleText(F.EMERGENCY_RELATIONSHIP)}
              disabled={disabled}
              placeholder="e.g., Spouse, Child"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Primary Caregiver */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Primary Caregiver
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Caregiver Name"
              value={formValues[F.PRIMARY_CAREGIVER] || ''}
              onChange={handleText(F.PRIMARY_CAREGIVER)}
              disabled={disabled}
              placeholder="Enter caregiver name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.CAREGIVER_PHONE] || ''}
              onChange={handleText(F.CAREGIVER_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Relationship"
              value={formValues[F.CAREGIVER_RELATIONSHIP] || ''}
              onChange={handleText(F.CAREGIVER_RELATIONSHIP)}
              disabled={disabled}
              placeholder="e.g., Spouse, Child"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Primary Care Physician */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Primary Care Physician
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Physician Name"
              value={formValues[F.PRIMARY_PHYSICIAN] || ''}
              onChange={handleText(F.PRIMARY_PHYSICIAN)}
              disabled={disabled}
              placeholder="Dr. Name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formValues[F.PHYSICIAN_PHONE] || ''}
              onChange={handleText(F.PHYSICIAN_PHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Address"
              value={formValues[F.PHYSICIAN_ADDRESS] || ''}
              onChange={handleText(F.PHYSICIAN_ADDRESS)}
              disabled={disabled}
              placeholder="Clinic address"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Pharmacy */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Pharmacy
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Pharmacy Name"
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Address"
              value={formValues[F.PHARMACY_ADDRESS] || ''}
              onChange={handleText(F.PHARMACY_ADDRESS)}
              disabled={disabled}
              placeholder="Pharmacy address"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ SOURCE INFORMATION ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Source Information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <CB name={F.SOURCE_CLIENT} label="Client" checked={checkboxValues[F.SOURCE_CLIENT]} onChange={handleCheckbox(F.SOURCE_CLIENT)} disabled={disabled} />
          <CB name={F.SOURCE_FAMILY} label="Family" checked={checkboxValues[F.SOURCE_FAMILY]} onChange={handleCheckbox(F.SOURCE_FAMILY)} disabled={disabled} />
          <CB name={F.SOURCE_OTHER} label="Other:" checked={checkboxValues[F.SOURCE_OTHER]} onChange={handleCheckbox(F.SOURCE_OTHER)} disabled={disabled} />
          <TextField
            size="small"
            value={formValues[F.SOURCE_OTHER_TEXT] || ''}
            onChange={handleText(F.SOURCE_OTHER_TEXT)}
            disabled={disabled}
            placeholder="Specify other"
            sx={{ width: 200 }}
          />
        </Box>
      </Paper>

      {/* ═══════ VITALS ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Vitals" />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={2.4}>
            <TextField
              fullWidth
              size="small"
              label="Temperature"
              value={formValues[F.TEMPERATURE] || ''}
              onChange={handleText(F.TEMPERATURE)}
              disabled={disabled}
              placeholder="°F"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <TextField
              fullWidth
              size="small"
              label="BP"
              value={formValues[F.BP] || ''}
              onChange={handleText(F.BP)}
              disabled={disabled}
              placeholder="120/80"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <TextField
              fullWidth
              size="small"
              label="HR"
              value={formValues[F.HR] || ''}
              onChange={handleText(F.HR)}
              disabled={disabled}
              placeholder="bpm"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <TextField
              fullWidth
              size="small"
              label="Respirations"
              value={formValues[F.RESPIRATIONS] || ''}
              onChange={handleText(F.RESPIRATIONS)}
              disabled={disabled}
              placeholder="/min"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <TextField
              fullWidth
              size="small"
              label="O2sat"
              value={formValues[F.O2SAT] || ''}
              onChange={handleText(F.O2SAT)}
              disabled={disabled}
              placeholder="%"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Special Diet"
              value={formValues[F.SPECIAL_DIET] || ''}
              onChange={handleText(F.SPECIAL_DIET)}
              disabled={disabled}
              placeholder="e.g., Diabetic, Low Sodium, Pureed"
              helperText="Any dietary restrictions or requirements"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ DIAGNOSIS & MEDICATIONS ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Client Diagnosis */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#1e3a5f' }}>
              Client Diagnosis
            </Typography>
            <Grid container spacing={1}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Grid item xs={12} sm={6} key={num}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`${num}.`}
                    value={formValues[F[`DIAGNOSIS_${num}`]] || ''}
                    onChange={handleText(F[`DIAGNOSIS_${num}`])}
                    disabled={disabled}
                    placeholder={`Diagnosis ${num}`}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Current Medications */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#1e3a5f' }}>
              Current Medications <Typography component="span" variant="caption">(Name / Dose / Frequency)</Typography>
            </Typography>
            <Grid container spacing={1}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Grid item xs={12} key={num}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`${num}.`}
                    value={formValues[F[`MED_${num}`]] || ''}
                    onChange={handleText(F[`MED_${num}`])}
                    disabled={disabled}
                    placeholder="Name / Dose / Frequency"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ ALLERGIES ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#c62828' }}>
            Allergic Reactions?
          </Typography>
          <CB name={F.ALLERGIC_YES} label="YES" checked={checkboxValues[F.ALLERGIC_YES]} onChange={handleCheckbox(F.ALLERGIC_YES)} disabled={disabled} />
          <CB name={F.ALLERGIC_NO} label="NO" checked={checkboxValues[F.ALLERGIC_NO]} onChange={handleCheckbox(F.ALLERGIC_NO)} disabled={disabled} />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Allergy</Typography>
            {[1, 2, 3].map((num) => (
              <TextField
                key={num}
                fullWidth
                size="small"
                label={`${num}.`}
                value={formValues[F[`ALLERGY_${num}`]] || ''}
                onChange={handleText(F[`ALLERGY_${num}`])}
                disabled={disabled}
                placeholder="Allergy name"
                sx={{ mb: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            ))}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reaction</Typography>
            {[1, 2, 3].map((num) => (
              <TextField
                key={num}
                fullWidth
                size="small"
                label={`${num}.`}
                value={formValues[F[`REACTION_${num}`]] || ''}
                onChange={handleText(F[`REACTION_${num}`])}
                disabled={disabled}
                placeholder="Reaction type"
                sx={{ mb: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            ))}
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ ADDITIONAL INFO ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Is there anything that we should know about the client that would be pertinent to the client's care and the welfare of our employees?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CB name={F.ADDITIONAL_INFO_YES} label="Yes" checked={checkboxValues[F.ADDITIONAL_INFO_YES]} onChange={handleCheckbox(F.ADDITIONAL_INFO_YES)} disabled={disabled} />
          <CB name={F.ADDITIONAL_INFO_NO} label="No" checked={checkboxValues[F.ADDITIONAL_INFO_NO]} onChange={handleCheckbox(F.ADDITIONAL_INFO_NO)} disabled={disabled} />
        </Box>
        <TextField
          fullWidth
          size="small"
          label="If yes, please briefly describe"
          value={formValues[F.ADDITIONAL_INFO_DESC] || ''}
          onChange={handleText(F.ADDITIONAL_INFO_DESC)}
          disabled={disabled}
          multiline
          rows={2}
          placeholder="Describe any relevant information..."
          InputLabelProps={{ shrink: true }}
        />
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE 2 - BODY SYSTEMS ASSESSMENT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2, textAlign: 'center' }}>
          Body Systems Assessment
        </Typography>

        <Grid container spacing={2}>
          {/* NEURO */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="NEURO">
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#666' }}>Level of Consciousness:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.NEURO_ALERT_ORIENTED} label="Alert and oriented" checked={checkboxValues[F.NEURO_ALERT_ORIENTED]} onChange={handleCheckbox(F.NEURO_ALERT_ORIENTED)} disabled={disabled} />
                <CB name={F.NEURO_CONFUSED} label="Confused at times" checked={checkboxValues[F.NEURO_CONFUSED]} onChange={handleCheckbox(F.NEURO_CONFUSED)} disabled={disabled} />
                <CB name={F.NEURO_DISORIENTED} label="Disoriented" checked={checkboxValues[F.NEURO_DISORIENTED]} onChange={handleCheckbox(F.NEURO_DISORIENTED)} disabled={disabled} />
                <CB name={F.NEURO_COMATOSE} label="Comatose" checked={checkboxValues[F.NEURO_COMATOSE]} onChange={handleCheckbox(F.NEURO_COMATOSE)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.NEURO_OTHER} label="Other:" checked={checkboxValues[F.NEURO_OTHER]} onChange={handleCheckbox(F.NEURO_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.NEURO_OTHER_TEXT] || ''} onChange={handleText(F.NEURO_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.NEURO_PERRLA} label="PERRLA" checked={checkboxValues[F.NEURO_PERRLA]} onChange={handleCheckbox(F.NEURO_PERRLA)} disabled={disabled} />
                <CB name={F.NEURO_MOVES_ALL} label="Moves all extremities without problems" checked={checkboxValues[F.NEURO_MOVES_ALL]} onChange={handleCheckbox(F.NEURO_MOVES_ALL)} disabled={disabled} />
                <CB name={F.NEURO_PARALYSIS} label="Paralysis" checked={checkboxValues[F.NEURO_PARALYSIS]} onChange={handleCheckbox(F.NEURO_PARALYSIS)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.NEURO_WEAKNESS} label="Weakness" checked={checkboxValues[F.NEURO_WEAKNESS]} onChange={handleCheckbox(F.NEURO_WEAKNESS)} disabled={disabled} />
                <TextField size="small" label="side" value={formValues[F.NEURO_WEAKNESS_SIDE] || ''} onChange={handleText(F.NEURO_WEAKNESS_SIDE)} disabled={disabled} sx={{ width: 100 }} InputLabelProps={{ shrink: true }} />
              </Box>
              <CB name={F.NEURO_ABNORMAL_GAIT} label="Abnormal gait" checked={checkboxValues[F.NEURO_ABNORMAL_GAIT]} onChange={handleCheckbox(F.NEURO_ABNORMAL_GAIT)} disabled={disabled} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CB name={F.NEURO_PAIN} label="Pain" checked={checkboxValues[F.NEURO_PAIN]} onChange={handleCheckbox(F.NEURO_PAIN)} disabled={disabled} />
                <TextField size="small" label="out of 10" value={formValues[F.NEURO_PAIN_LEVEL] || ''} onChange={handleText(F.NEURO_PAIN_LEVEL)} disabled={disabled} sx={{ width: 80 }} InputLabelProps={{ shrink: true }} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* SKIN */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="SKIN">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.SKIN_WARM_DRY} label="Warm and dry" checked={checkboxValues[F.SKIN_WARM_DRY]} onChange={handleCheckbox(F.SKIN_WARM_DRY)} disabled={disabled} />
                <CB name={F.SKIN_COOL} label="Cool" checked={checkboxValues[F.SKIN_COOL]} onChange={handleCheckbox(F.SKIN_COOL)} disabled={disabled} />
                <CB name={F.SKIN_MOIST} label="Moist" checked={checkboxValues[F.SKIN_MOIST]} onChange={handleCheckbox(F.SKIN_MOIST)} disabled={disabled} />
                <CB name={F.SKIN_PRESSURE_ULCER} label="Pressure Ulcer" checked={checkboxValues[F.SKIN_PRESSURE_ULCER]} onChange={handleCheckbox(F.SKIN_PRESSURE_ULCER)} disabled={disabled} />
                <CB name={F.SKIN_WOUNDS} label="Wounds" checked={checkboxValues[F.SKIN_WOUNDS]} onChange={handleCheckbox(F.SKIN_WOUNDS)} disabled={disabled} />
                <CB name={F.SKIN_RASH} label="Rash" checked={checkboxValues[F.SKIN_RASH]} onChange={handleCheckbox(F.SKIN_RASH)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.SKIN_EDEMA} label="Peripheral edema" checked={checkboxValues[F.SKIN_EDEMA]} onChange={handleCheckbox(F.SKIN_EDEMA)} disabled={disabled} />
                <TextField size="small" label="Where" value={formValues[F.SKIN_EDEMA_WHERE] || ''} onChange={handleText(F.SKIN_EDEMA_WHERE)} disabled={disabled} sx={{ flex: 1 }} InputLabelProps={{ shrink: true }} />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Color:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.SKIN_COLOR_NORMAL} label="Normal" checked={checkboxValues[F.SKIN_COLOR_NORMAL]} onChange={handleCheckbox(F.SKIN_COLOR_NORMAL)} disabled={disabled} />
                <CB name={F.SKIN_COLOR_FLUSHED} label="Flushed" checked={checkboxValues[F.SKIN_COLOR_FLUSHED]} onChange={handleCheckbox(F.SKIN_COLOR_FLUSHED)} disabled={disabled} />
                <CB name={F.SKIN_COLOR_PALE} label="Pale" checked={checkboxValues[F.SKIN_COLOR_PALE]} onChange={handleCheckbox(F.SKIN_COLOR_PALE)} disabled={disabled} />
                <CB name={F.SKIN_COLOR_CYANOTIC} label="Cyanotic" checked={checkboxValues[F.SKIN_COLOR_CYANOTIC]} onChange={handleCheckbox(F.SKIN_COLOR_CYANOTIC)} disabled={disabled} />
                <CB name={F.SKIN_COLOR_JAUNDICE} label="Jaundice" checked={checkboxValues[F.SKIN_COLOR_JAUNDICE]} onChange={handleCheckbox(F.SKIN_COLOR_JAUNDICE)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* CARDIOVASCULAR */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="CARDIOVASCULAR">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.CV_HR_REGULAR} label="HR regular" checked={checkboxValues[F.CV_HR_REGULAR]} onChange={handleCheckbox(F.CV_HR_REGULAR)} disabled={disabled} />
                <CB name={F.CV_HR_IRREGULAR} label="HR irregular" checked={checkboxValues[F.CV_HR_IRREGULAR]} onChange={handleCheckbox(F.CV_HR_IRREGULAR)} disabled={disabled} />
                <CB name={F.CV_PACEMAKER} label="Pacemaker" checked={checkboxValues[F.CV_PACEMAKER]} onChange={handleCheckbox(F.CV_PACEMAKER)} disabled={disabled} />
                <CB name={F.CV_HYPERTENSION} label="Hypertension" checked={checkboxValues[F.CV_HYPERTENSION]} onChange={handleCheckbox(F.CV_HYPERTENSION)} disabled={disabled} />
                <CB name={F.CV_CARDIAC_HISTORY} label="History of cardiac problems" checked={checkboxValues[F.CV_CARDIAC_HISTORY]} onChange={handleCheckbox(F.CV_CARDIAC_HISTORY)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* GASTROINTESTINAL */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="GASTROINTESTINAL">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.GI_NO_PROBLEMS} label="No history of problems" checked={checkboxValues[F.GI_NO_PROBLEMS]} onChange={handleCheckbox(F.GI_NO_PROBLEMS)} disabled={disabled} />
                <CB name={F.GI_CONSTIPATION} label="Constipation" checked={checkboxValues[F.GI_CONSTIPATION]} onChange={handleCheckbox(F.GI_CONSTIPATION)} disabled={disabled} />
                <CB name={F.GI_DIARRHEA} label="Diarrhea" checked={checkboxValues[F.GI_DIARRHEA]} onChange={handleCheckbox(F.GI_DIARRHEA)} disabled={disabled} />
                <CB name={F.GI_NG_TUBE} label="NG tube" checked={checkboxValues[F.GI_NG_TUBE]} onChange={handleCheckbox(F.GI_NG_TUBE)} disabled={disabled} />
                <CB name={F.GI_G_TUBE} label="G-Tube" checked={checkboxValues[F.GI_G_TUBE]} onChange={handleCheckbox(F.GI_G_TUBE)} disabled={disabled} />
                <CB name={F.GI_TPN} label="TPN" checked={checkboxValues[F.GI_TPN]} onChange={handleCheckbox(F.GI_TPN)} disabled={disabled} />
                <CB name={F.GI_ABDOMEN_SOFT} label="Abdomen soft, nontender" checked={checkboxValues[F.GI_ABDOMEN_SOFT]} onChange={handleCheckbox(F.GI_ABDOMEN_SOFT)} disabled={disabled} />
                <CB name={F.GI_ABDOMEN_FIRM} label="Abdomen firm, nondistended" checked={checkboxValues[F.GI_ABDOMEN_FIRM]} onChange={handleCheckbox(F.GI_ABDOMEN_FIRM)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* GENITOURINARY */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="GENITOURINARY">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.GU_NO_PROBLEMS} label="No history of problems" checked={checkboxValues[F.GU_NO_PROBLEMS]} onChange={handleCheckbox(F.GU_NO_PROBLEMS)} disabled={disabled} />
                <CB name={F.GU_INCONTINENT_URINE} label="Incontinent of urine" checked={checkboxValues[F.GU_INCONTINENT_URINE]} onChange={handleCheckbox(F.GU_INCONTINENT_URINE)} disabled={disabled} />
                <CB name={F.GU_FOLEY} label="Foley catheter" checked={checkboxValues[F.GU_FOLEY]} onChange={handleCheckbox(F.GU_FOLEY)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.GU_OTHER} label="Other:" checked={checkboxValues[F.GU_OTHER]} onChange={handleCheckbox(F.GU_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.GU_OTHER_TEXT] || ''} onChange={handleText(F.GU_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.GU_CONTINENT} label="Continent" checked={checkboxValues[F.GU_CONTINENT]} onChange={handleCheckbox(F.GU_CONTINENT)} disabled={disabled} />
                <CB name={F.GU_INCONTINENT} label="Incontinent" checked={checkboxValues[F.GU_INCONTINENT]} onChange={handleCheckbox(F.GU_INCONTINENT)} disabled={disabled} />
                <CB name={F.GU_TENDERNESS} label="Tenderness present" checked={checkboxValues[F.GU_TENDERNESS]} onChange={handleCheckbox(F.GU_TENDERNESS)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.GU_BOWEL_OTHER} label="Other:" checked={checkboxValues[F.GU_BOWEL_OTHER]} onChange={handleCheckbox(F.GU_BOWEL_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.GU_BOWEL_OTHER_TEXT] || ''} onChange={handleText(F.GU_BOWEL_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* RESPIRATORY */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="RESPIRATORY">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.RESP_REGULAR} label="Respirations regular and unlabored, lungs clear" checked={checkboxValues[F.RESP_REGULAR]} onChange={handleCheckbox(F.RESP_REGULAR)} disabled={disabled} />
                <CB name={F.RESP_SOB} label="SOB" checked={checkboxValues[F.RESP_SOB]} onChange={handleCheckbox(F.RESP_SOB)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.RESP_ABNORMAL_BREATH} label="Abnormal breath sounds:" checked={checkboxValues[F.RESP_ABNORMAL_BREATH]} onChange={handleCheckbox(F.RESP_ABNORMAL_BREATH)} disabled={disabled} />
                <TextField size="small" value={formValues[F.RESP_ABNORMAL_BREATH_TEXT] || ''} onChange={handleText(F.RESP_ABNORMAL_BREATH_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.RESP_USES_O2} label="Uses O2 at" checked={checkboxValues[F.RESP_USES_O2]} onChange={handleCheckbox(F.RESP_USES_O2)} disabled={disabled} />
                <TextField size="small" label="liter/min" value={formValues[F.RESP_USES_O2_RATE] || ''} onChange={handleText(F.RESP_USES_O2_RATE)} disabled={disabled} sx={{ width: 100 }} InputLabelProps={{ shrink: true }} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                <CB name={F.RESP_COUGH} label="Cough" checked={checkboxValues[F.RESP_COUGH]} onChange={handleCheckbox(F.RESP_COUGH)} disabled={disabled} />
                <CB name={F.RESP_DYSPNEA} label="Dyspnea" checked={checkboxValues[F.RESP_DYSPNEA]} onChange={handleCheckbox(F.RESP_DYSPNEA)} disabled={disabled} />
                <CB name={F.RESP_COPD} label="COPD" checked={checkboxValues[F.RESP_COPD]} onChange={handleCheckbox(F.RESP_COPD)} disabled={disabled} />
                <CB name={F.RESP_SMOKER} label="Smoker" checked={checkboxValues[F.RESP_SMOKER]} onChange={handleCheckbox(F.RESP_SMOKER)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* ENDOCRINE */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="ENDOCRINE">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.ENDO_NO_PROBLEMS} label="No history of problems" checked={checkboxValues[F.ENDO_NO_PROBLEMS]} onChange={handleCheckbox(F.ENDO_NO_PROBLEMS)} disabled={disabled} />
                <CB name={F.ENDO_DIABETES} label="Diabetes" checked={checkboxValues[F.ENDO_DIABETES]} onChange={handleCheckbox(F.ENDO_DIABETES)} disabled={disabled} />
                <CB name={F.ENDO_INSULIN} label="Insulin dependent" checked={checkboxValues[F.ENDO_INSULIN]} onChange={handleCheckbox(F.ENDO_INSULIN)} disabled={disabled} />
                <CB name={F.ENDO_PO_MED} label="Antidiabetic P.O. medication" checked={checkboxValues[F.ENDO_PO_MED]} onChange={handleCheckbox(F.ENDO_PO_MED)} disabled={disabled} />
                <CB name={F.ENDO_DIET_CONTROLLED} label="Diet controlled" checked={checkboxValues[F.ENDO_DIET_CONTROLLED]} onChange={handleCheckbox(F.ENDO_DIET_CONTROLLED)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.ENDO_THYROID} label="Thyroid disease:" checked={checkboxValues[F.ENDO_THYROID]} onChange={handleCheckbox(F.ENDO_THYROID)} disabled={disabled} />
                <TextField size="small" value={formValues[F.ENDO_THYROID_TEXT] || ''} onChange={handleText(F.ENDO_THYROID_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.ENDO_OTHER} label="Other:" checked={checkboxValues[F.ENDO_OTHER]} onChange={handleCheckbox(F.ENDO_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.ENDO_OTHER_TEXT] || ''} onChange={handleText(F.ENDO_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* MUSCULOSKELETAL */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="MUSCULOSKELETAL">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.MSK_NO_PROBLEMS} label="No problems" checked={checkboxValues[F.MSK_NO_PROBLEMS]} onChange={handleCheckbox(F.MSK_NO_PROBLEMS)} disabled={disabled} />
                <CB name={F.MSK_ARTHRITIS} label="Arthritis" checked={checkboxValues[F.MSK_ARTHRITIS]} onChange={handleCheckbox(F.MSK_ARTHRITIS)} disabled={disabled} />
                <CB name={F.MSK_FRACTURE} label="Fracture" checked={checkboxValues[F.MSK_FRACTURE]} onChange={handleCheckbox(F.MSK_FRACTURE)} disabled={disabled} />
                <CB name={F.MSK_SPINAL_CORD} label="Spinal Cord Injury" checked={checkboxValues[F.MSK_SPINAL_CORD]} onChange={handleCheckbox(F.MSK_SPINAL_CORD)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.MSK_OTHER} label="Other:" checked={checkboxValues[F.MSK_OTHER]} onChange={handleCheckbox(F.MSK_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.MSK_OTHER_TEXT] || ''} onChange={handleText(F.MSK_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* PSYCHOLOGICAL */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="PSYCHOLOGICAL">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.PSYCH_CALM} label="Calm" checked={checkboxValues[F.PSYCH_CALM]} onChange={handleCheckbox(F.PSYCH_CALM)} disabled={disabled} />
                <CB name={F.PSYCH_AGITATED} label="Agitated" checked={checkboxValues[F.PSYCH_AGITATED]} onChange={handleCheckbox(F.PSYCH_AGITATED)} disabled={disabled} />
                <CB name={F.PSYCH_FLAT} label="Flat affect" checked={checkboxValues[F.PSYCH_FLAT]} onChange={handleCheckbox(F.PSYCH_FLAT)} disabled={disabled} />
                <CB name={F.PSYCH_ANXIOUS} label="Anxious" checked={checkboxValues[F.PSYCH_ANXIOUS]} onChange={handleCheckbox(F.PSYCH_ANXIOUS)} disabled={disabled} />
                <CB name={F.PSYCH_DEPRESSED} label="Depressed" checked={checkboxValues[F.PSYCH_DEPRESSED]} onChange={handleCheckbox(F.PSYCH_DEPRESSED)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.PSYCH_OTHER} label="Other:" checked={checkboxValues[F.PSYCH_OTHER]} onChange={handleCheckbox(F.PSYCH_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.PSYCH_OTHER_TEXT] || ''} onChange={handleText(F.PSYCH_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
            </CheckboxSection>
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ MEDICAL HISTORY ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Medical History" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Hospital Admissions within 5 years"
              value={formValues[F.HOSPITAL_ADMISSIONS] || ''}
              onChange={handleText(F.HOSPITAL_ADMISSIONS)}
              disabled={disabled}
              multiline
              rows={2}
              placeholder="List hospital admissions in the past 5 years"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Surgeries"
              value={formValues[F.SURGERIES] || ''}
              onChange={handleText(F.SURGERIES)}
              disabled={disabled}
              multiline
              rows={2}
              placeholder="List any surgeries"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="On-going Medical Problems"
              value={formValues[F.ONGOING_PROBLEMS] || ''}
              onChange={handleText(F.ONGOING_PROBLEMS)}
              disabled={disabled}
              multiline
              rows={2}
              placeholder="List ongoing medical conditions"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE 3 - FUNCTIONAL ASSESSMENT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2, textAlign: 'center' }}>
          Functional Assessment
        </Typography>

        <Grid container spacing={2}>
          {/* EATING */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="EATING">
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CB name={F.EATING_INDEPENDENT_PREP} label="Independent in food preparation and eating" checked={checkboxValues[F.EATING_INDEPENDENT_PREP]} onChange={handleCheckbox(F.EATING_INDEPENDENT_PREP)} disabled={disabled} />
                <CB name={F.EATING_INDEPENDENT} label="Independent in eating" checked={checkboxValues[F.EATING_INDEPENDENT]} onChange={handleCheckbox(F.EATING_INDEPENDENT)} disabled={disabled} />
                <CB name={F.EATING_SUPERVISION} label="Can prepare and eat meals with supervision" checked={checkboxValues[F.EATING_SUPERVISION]} onChange={handleCheckbox(F.EATING_SUPERVISION)} disabled={disabled} />
                <CB name={F.EATING_ASSISTANCE} label="Requires assistance with eating, requires preparation of meals" checked={checkboxValues[F.EATING_ASSISTANCE]} onChange={handleCheckbox(F.EATING_ASSISTANCE)} disabled={disabled} />
                <CB name={F.EATING_TOTAL_ASSISTANCE} label="Needs meals prepared and total assistance with eating" checked={checkboxValues[F.EATING_TOTAL_ASSISTANCE]} onChange={handleCheckbox(F.EATING_TOTAL_ASSISTANCE)} disabled={disabled} />
                <CB name={F.EATING_G_TUBE} label="Receives G-tube feeding / TPN" checked={checkboxValues[F.EATING_G_TUBE]} onChange={handleCheckbox(F.EATING_G_TUBE)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* BATHING */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="BATHING">
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CB name={F.BATHING_INDEPENDENT} label="Independent" checked={checkboxValues[F.BATHING_INDEPENDENT]} onChange={handleCheckbox(F.BATHING_INDEPENDENT)} disabled={disabled} />
                <CB name={F.BATHING_MINIMAL} label="Needs supervision, minimal assistance" checked={checkboxValues[F.BATHING_MINIMAL]} onChange={handleCheckbox(F.BATHING_MINIMAL)} disabled={disabled} />
                <CB name={F.BATHING_SUBSTANTIAL} label="Requires substantial amount of assistance" checked={checkboxValues[F.BATHING_SUBSTANTIAL]} onChange={handleCheckbox(F.BATHING_SUBSTANTIAL)} disabled={disabled} />
                <CB name={F.BATHING_TOTAL} label="Needs to be bathed or showered, unable to assist" checked={checkboxValues[F.BATHING_TOTAL]} onChange={handleCheckbox(F.BATHING_TOTAL)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* TOILETING */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="TOILETING">
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CB name={F.TOILET_INDEPENDENT} label="Independent" checked={checkboxValues[F.TOILET_INDEPENDENT]} onChange={handleCheckbox(F.TOILET_INDEPENDENT)} disabled={disabled} />
                <CB name={F.TOILET_SUPERVISION} label="Needs some supervision in using bathroom" checked={checkboxValues[F.TOILET_SUPERVISION]} onChange={handleCheckbox(F.TOILET_SUPERVISION)} disabled={disabled} />
                <CB name={F.TOILET_SUBSTANTIAL} label="Needs substantial assistance in using bathroom, personal" checked={checkboxValues[F.TOILET_SUBSTANTIAL]} onChange={handleCheckbox(F.TOILET_SUBSTANTIAL)} disabled={disabled} />
                <CB name={F.TOILET_HYGIENE} label="Hygiene" checked={checkboxValues[F.TOILET_HYGIENE]} onChange={handleCheckbox(F.TOILET_HYGIENE)} disabled={disabled} />
                <CB name={F.TOILET_UNABLE} label="Unable to use bathroom, uses diapers or briefs" checked={checkboxValues[F.TOILET_UNABLE]} onChange={handleCheckbox(F.TOILET_UNABLE)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* DRESSING */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="DRESSING">
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CB name={F.DRESS_INDEPENDENT} label="Independent, can dress self" checked={checkboxValues[F.DRESS_INDEPENDENT]} onChange={handleCheckbox(F.DRESS_INDEPENDENT)} disabled={disabled} />
                <CB name={F.DRESS_SUPERVISION} label="Needs supervision" checked={checkboxValues[F.DRESS_SUPERVISION]} onChange={handleCheckbox(F.DRESS_SUPERVISION)} disabled={disabled} />
                <CB name={F.DRESS_ASSISTANCE} label="Requires assistance" checked={checkboxValues[F.DRESS_ASSISTANCE]} onChange={handleCheckbox(F.DRESS_ASSISTANCE)} disabled={disabled} />
                <CB name={F.DRESS_TOTAL} label="Needs to be dressed" checked={checkboxValues[F.DRESS_TOTAL]} onChange={handleCheckbox(F.DRESS_TOTAL)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* WALKING / AMBULATION STATUS */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="WALKING / AMBULATION STATUS">
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CB name={F.WALK_INDEPENDENT} label="Walks independently" checked={checkboxValues[F.WALK_INDEPENDENT]} onChange={handleCheckbox(F.WALK_INDEPENDENT)} disabled={disabled} />
                <CB name={F.WALK_WITH_ASSISTANCE} label="Can walk with another's assistance" checked={checkboxValues[F.WALK_WITH_ASSISTANCE]} onChange={handleCheckbox(F.WALK_WITH_ASSISTANCE)} disabled={disabled} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CB name={F.WALK_DEVICE} label="Needs device to ambulate:" checked={checkboxValues[F.WALK_DEVICE]} onChange={handleCheckbox(F.WALK_DEVICE)} disabled={disabled} />
                  <TextField size="small" value={formValues[F.WALK_DEVICE_TEXT] || ''} onChange={handleText(F.WALK_DEVICE_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
                </Box>
                <CB name={F.WALK_WHEELCHAIR} label="Uses wheelchair, cannot ambulate" checked={checkboxValues[F.WALK_WHEELCHAIR]} onChange={handleCheckbox(F.WALK_WHEELCHAIR)} disabled={disabled} />
                <CB name={F.WALK_WEIGHT_BEAR} label="Can weight bear for transfers" checked={checkboxValues[F.WALK_WEIGHT_BEAR]} onChange={handleCheckbox(F.WALK_WEIGHT_BEAR)} disabled={disabled} />
                <CB name={F.WALK_HOYER} label="Hoyer" checked={checkboxValues[F.WALK_HOYER]} onChange={handleCheckbox(F.WALK_HOYER)} disabled={disabled} />
              </Box>
            </CheckboxSection>
          </Grid>

          {/* EQUIPMENT */}
          <Grid item xs={12} md={6}>
            <CheckboxSection title="EQUIPMENT">
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <CB name={F.EQUIP_CANE} label="Cane" checked={checkboxValues[F.EQUIP_CANE]} onChange={handleCheckbox(F.EQUIP_CANE)} disabled={disabled} />
                <CB name={F.EQUIP_WALKER} label="Walker" checked={checkboxValues[F.EQUIP_WALKER]} onChange={handleCheckbox(F.EQUIP_WALKER)} disabled={disabled} />
                <CB name={F.EQUIP_WHEELCHAIR} label="Wheelchair" checked={checkboxValues[F.EQUIP_WHEELCHAIR]} onChange={handleCheckbox(F.EQUIP_WHEELCHAIR)} disabled={disabled} />
                <CB name={F.EQUIP_GLASSES} label="Glasses" checked={checkboxValues[F.EQUIP_GLASSES]} onChange={handleCheckbox(F.EQUIP_GLASSES)} disabled={disabled} />
                <CB name={F.EQUIP_CONTACTS} label="Contact lenses" checked={checkboxValues[F.EQUIP_CONTACTS]} onChange={handleCheckbox(F.EQUIP_CONTACTS)} disabled={disabled} />
                <CB name={F.EQUIP_HEARING_AID} label="Hearing aid" checked={checkboxValues[F.EQUIP_HEARING_AID]} onChange={handleCheckbox(F.EQUIP_HEARING_AID)} disabled={disabled} />
                <CB name={F.EQUIP_DENTURES_UPPER} label="Dentures: Upper Partials" checked={checkboxValues[F.EQUIP_DENTURES_UPPER]} onChange={handleCheckbox(F.EQUIP_DENTURES_UPPER)} disabled={disabled} />
                <CB name={F.EQUIP_DENTURES_LOWER} label="Lower Partials" checked={checkboxValues[F.EQUIP_DENTURES_LOWER]} onChange={handleCheckbox(F.EQUIP_DENTURES_LOWER)} disabled={disabled} />
                <CB name={F.EQUIP_PROSTHESIS} label="Prosthesis" checked={checkboxValues[F.EQUIP_PROSTHESIS]} onChange={handleCheckbox(F.EQUIP_PROSTHESIS)} disabled={disabled} />
                <CB name={F.EQUIP_SHOWER_CHAIR} label="Shower Chair" checked={checkboxValues[F.EQUIP_SHOWER_CHAIR]} onChange={handleCheckbox(F.EQUIP_SHOWER_CHAIR)} disabled={disabled} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CB name={F.EQUIP_OTHER} label="Other:" checked={checkboxValues[F.EQUIP_OTHER]} onChange={handleCheckbox(F.EQUIP_OTHER)} disabled={disabled} />
                <TextField size="small" value={formValues[F.EQUIP_OTHER_TEXT] || ''} onChange={handleText(F.EQUIP_OTHER_TEXT)} disabled={disabled} sx={{ flex: 1 }} />
              </Box>
            </CheckboxSection>
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ SOCIAL ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Social" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Primary Language"
              value={formValues[F.PRIMARY_LANGUAGE] || ''}
              onChange={handleText(F.PRIMARY_LANGUAGE)}
              disabled={disabled}
              placeholder="e.g., English, Spanish"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Highest Level of Schooling"
              value={formValues[F.EDUCATION_LEVEL] || ''}
              onChange={handleText(F.EDUCATION_LEVEL)}
              disabled={disabled}
              placeholder="e.g., High School, Bachelor's"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Former Occupation"
              value={formValues[F.FORMER_OCCUPATION] || ''}
              onChange={handleText(F.FORMER_OCCUPATION)}
              disabled={disabled}
              placeholder="Previous job or profession"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Hobbies and Interests"
              value={formValues[F.HOBBIES] || ''}
              onChange={handleText(F.HOBBIES)}
              disabled={disabled}
              placeholder="Activities client enjoys"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Client Lives:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              <CB name={F.LIVES_ALONE} label="Alone" checked={checkboxValues[F.LIVES_ALONE]} onChange={handleCheckbox(F.LIVES_ALONE)} disabled={disabled} />
              <CB name={F.LIVES_SIGNIFICANT_OTHER} label="With significant other(s)" checked={checkboxValues[F.LIVES_SIGNIFICANT_OTHER]} onChange={handleCheckbox(F.LIVES_SIGNIFICANT_OTHER)} disabled={disabled} />
              <CB name={F.LIVES_FAMILY} label="With family" checked={checkboxValues[F.LIVES_FAMILY]} onChange={handleCheckbox(F.LIVES_FAMILY)} disabled={disabled} />
              <CB name={F.LIVES_OTHER} label="Other:" checked={checkboxValues[F.LIVES_OTHER]} onChange={handleCheckbox(F.LIVES_OTHER)} disabled={disabled} />
              <TextField size="small" value={formValues[F.LIVES_OTHER_TEXT] || ''} onChange={handleText(F.LIVES_OTHER_TEXT)} disabled={disabled} sx={{ width: 200 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════ ASSESSOR'S SIGNATURE ═══════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <SectionHeader title="Assessor's Signature" subtitle="To be completed by the assessor" />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <SignaturePad
              label="Assessor's Signature"
              value={signatureValues[F.ASSESSOR_SIG]}
              onChange={handleSignature(F.ASSESSOR_SIG)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Date"
              type="date"
              value={formValues[F.ASSESSOR_DATE] || ''}
              onChange={handleText(F.ASSESSOR_DATE)}
              disabled={disabled}
              helperText="Assessment date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Print Name"
              value={formValues[F.ASSESSOR_PRINT_NAME] || ''}
              onChange={handleText(F.ASSESSOR_PRINT_NAME)}
              disabled={disabled}
              placeholder="Assessor's full name"
              helperText="Name of person completing assessment"
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
          100/MC-Rev.1025 | ©Mastercare All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default PhysicalAssessmentLayout;
