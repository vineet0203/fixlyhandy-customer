/**
 * InfantChildAssessmentLayout.jsx
 *
 * Custom form layout for "130-Infant-Child Assessment_TX.pdf"
 * Comprehensive nursing assessment form for infant and child clients.
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
  // Header fields
  CLIENT_NAME: 'Client Name',
  EMPLOYEE_NAME: 'Employee Name 1',
  SIGNATURE: 'Signature',
  DATE: 'undefined',
  TIME_IN: 'Time In',
  TIME_OUT: 'Time Out',

  // Cardiovascular - Lips/Nails/Skin
  CV_NORMAL_PINK: 'Normal Pink',
  CV_PALE: 'Pale',
  CV_CYANOTIC: 'Cyanotic',
  CV_MOTTLED: 'Mottled',

  // Cardiovascular - Edema
  CV_EDEMA_ABSENT: 'Absent',
  CV_EDEMA_PRESENT: 'Present',

  // Cardiovascular - Pulses
  CV_PULSES_CYANOTIC: 'Cyanotic_2',
  CV_PULSES_MOTTLED: 'Mottled_2',

  // Urinary - Urine
  UR_NO_UTI: 'No UTI',
  UR_UTI_SYMPTOMS: 'UTI Symptoms',
  UR_DECREASED_AMOUNT: 'Decreased Amount',
  UR_URINE_NOTES: 'Urine',

  // Urinary - Method
  UR_CONTINENT: 'Continent',
  UR_DIAPER: 'undefined_4',
  UR_FOLEY: 'undefined_5',

  // Eyes, Ears, Nose, Throat
  EENT_NOTES: 'Of Mucus Membrane',

  // Turgor/Hydration - Of Mucus Membrane
  TH_NORMAL: 'Normal',
  TH_ABNORMAL: 'Abnormal',

  // Neurological
  NEURO_ALERT: 'Alert',
  NEURO_RESPONDS_APPROPRIATELY: 'Responds Appropriately',
  NEURO_USUAL_TEMPERAMENT: 'Usual Temperament',
  NEURO_MENTALLY_DELAYED: 'Mentally Delayed',
  NEURO_PUPILS_EQUAL: 'Pupils equal  reactive',
  NEURO_FUSSY_IRRITABLE: 'Fussy  irritable  crying',
  NEURO_LETHARGIC: 'Lethargic',
  NEURO_COMATOSE: 'Comatose',
  NEURO_SPEECH_PROBLEM: 'Speech Problem',
  NEURO_PARALYSIS_PARESIS: 'Paralysis  paresis',
  NEURO_RESTLESSNESS: 'Restlessness',
  NEURO_CHANGE_SLEEP: 'Change in sleep routine',

  // Bowel Sounds
  BS_PRESENT: 'Present',
  BS_ABSENT: 'Absent',
  BS_HYPOACTIVE: 'Hypoactive',
  BS_HYPERACTIVE: 'Hyperactive',

  // Appetite
  APP_GOOD: 'Good',
  APP_BAD: 'Bad',
  APP_POOR: 'Poor',
  APP_WEIGHT_GAIN: 'Weight Gain',
  APP_WEIGHT_LOSS: 'Weight Loss',
  APP_NAUSEA_VOMITING: 'Nausea  Vomiting',

  // Tube Feeding
  TF_LOCATION: 'Location',
  TF_TOLERANCE: 'Tolerance',
  TF_JEJUNUM: 'Jejunum',

  // Respiratory - Respiration
  RESP_REGULAR: 'Regular  Unlabored',
  RESP_IRREGULAR: 'Irregular',
  RESP_DYSPNEA: 'Dyspnea',
  RESP_RETRACTIONS: 'Retractions',
  RESP_O2: 'O2',
  RESP_O2_RATE: 'ltrsmin',
  RESP_NEBULIZER: 'Nebulizer Rxs',
  RESP_TRACHEOSTOMY: 'Tracheostomy',
  RESP_APNEA_MONITOR: 'Apnea Monitor',
  RESP_VENTILATOR: 'Ventilator',

  // Respiratory - Sounds
  RESP_SOUNDS_CLEAR: 'Clear',
  RESP_SOUNDS_PHONCI: 'Phonci',
  RESP_SOUNDS_CRACKLES: 'Crackles',
  RESP_SOUNDS_WHEEZE: 'Wheeze',
  RESP_SOUNDS_DECREASED: 'Decreased',

  // Respiratory - Cough
  RESP_NO_COUGH: 'No Cough',
  RESP_NON_PRODUCTIVE: 'NonProductive Cough',
  RESP_PRODUCTIVE: 'Productive Cough',

  // Skin - Temperature Feel
  SKIN_WARM: 'Warm',
  SKIN_HOT: 'Hot',
  SKIN_COOL: 'Cool',
  SKIN_DIAPHORETIC: 'Diaphoretic',
  SKIN_CLAMMY: 'Clammy',

  // Skin - Color
  SKIN_COLOR_NORMAL: 'Normal_2',
  SKIN_COLOR_PALE: 'Pale_2',
  SKIN_COLOR_FLUSHED: 'Flushed',
  SKIN_COLOR_CYANOTIC: 'Cyanotic_3',
  SKIN_COLOR_JAUNDICED: 'Jaundiced',

  // Skin - Integrity
  SKIN_INTACT: 'Intact',
  SKIN_ABNORMALLY_DRY: 'Abnormally Dry',
  SKIN_BRUISES_WOUNDS: 'BruisesOpen Wounds',
  SKIN_RASH: 'Rash',
  SKIN_REDNESS: 'Redness',
  SKIN_ITCHING: 'Itching',

  // Gastrointestinal - Abdomen
  GI_SOFT: 'Soft',
  GI_DISTENDED: 'Distended',
  GI_FIRM: 'Firm',
  GI_PAIN_COLIC: 'Pain or Colic',

  // Gastrointestinal - Stools
  GI_USUAL_COLOR: 'Usual Color',
  GI_CONTINENT_STOOL: 'Continent',
  GI_SOFT_FORM: 'Soft Form',
  GI_LOOSE_DIARRHEA: 'Loose  Diarrhea',
  GI_MUCUS_WATERY: 'Mucus or Watery',
  GI_CONSTIPATION: 'Constipation',

  // Musculoskeletal
  MSK_CRAWLS_WALKS: 'undefined_6',
  MSK_DEVELOPMENT_PROGRESS: 'undefined_7',
  MSK_RETRACTIONS: 'Retractions_2',
  MSK_NORMAL_TONE: 'Normal Muscle Tone',
  MSK_DELAYED_MOTOR: 'Delayed Motor Skills',
  MSK_MUSCLE_PAIN: 'Muscle Pain',
  MSK_FRACTURE_CAST: 'FractureCast',
  MSK_CONTRACTURES: 'Contractures',
  MSK_JOINT_PROBLEMS: 'Joint Problems',
  MSK_GEN_WEAKNESS: 'Generalized Weakness',
  MSK_MUSCLE_WEAKNESS: 'Muscle Weakness',
  MSK_LUE: '1',
  MSK_RUE: '2',
  MSK_LLE: '3',
  MSK_RLE: '4',

  // Vital Signs
  VS_TEMPERATURE: 'Temperature',
  VS_PULSE: 'O R A PULSE',
  VS_APICAL: 'Apical Rad Brach RESP',
  VS_RAD: 'undefined_11',
  VS_BRACH: 'undefined_12',
  VS_RESP: 'Decr3',
  VS_BP: 'BP',
  VS_WT: 'WT',
  VS_HT: 'HT',

  // Notes
  NOTES: 'Notes',
};

/**
 * Auto-sync mapping
 */
export const INFANT_CHILD_ASSESSMENT_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const SectionHeader = ({ title, color = '#1e3a5f' }) => (
  <Box sx={{ mb: 1 }}>
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 700,
        color: '#fff',
        bgcolor: color,
        px: 1,
        py: 0.5,
        fontSize: '0.8rem',
      }}
    >
      {title}
    </Typography>
  </Box>
);

const CheckboxSection = ({ title, children, color = '#1e3a5f' }) => (
  <Paper elevation={1} sx={{ p: 1.5, mb: 2 }}>
    <SectionHeader title={title} color={color} />
    <FormGroup>
      {children}
    </FormGroup>
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
    label={<Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{label}</Typography>}
    sx={{ mr: 1, mb: 0, minWidth: '45%' }}
  />
);

// ─── Main Component ─────────────────────────────────────────────────────

const InfantChildAssessmentLayout = ({
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
          Infant and Child Nursing Assessment
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CLIENT & EMPLOYEE INFO
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Employee Name"
              value={formValues[F.EMPLOYEE_NAME] || ''}
              onChange={handleText(F.EMPLOYEE_NAME)}
              disabled={disabled}
              placeholder="Enter employee's name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SignaturePad
              label="Employee Signature"
              value={signatureValues[F.SIGNATURE]}
              onChange={handleSignature(F.SIGNATURE)}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="time"
                  label="Time In"
                  value={formValues[F.TIME_IN] || ''}
                  onChange={handleText(F.TIME_IN)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  type="time"
                  label="Time Out"
                  value={formValues[F.TIME_OUT] || ''}
                  onChange={handleText(F.TIME_OUT)}
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          ASSESSMENT SECTIONS - Row 1
      ═══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={2}>
        {/* CARDIOVASCULAR */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Cardiovascular">
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Lips/Nails/Skin
            </Typography>
            <CB name={F.CV_NORMAL_PINK} label="Normal Pink" checked={checkboxValues[F.CV_NORMAL_PINK]} onChange={handleCheckbox(F.CV_NORMAL_PINK)} disabled={disabled} />
            <CB name={F.CV_PALE} label="Pale" checked={checkboxValues[F.CV_PALE]} onChange={handleCheckbox(F.CV_PALE)} disabled={disabled} />
            <CB name={F.CV_CYANOTIC} label="Cyanotic" checked={checkboxValues[F.CV_CYANOTIC]} onChange={handleCheckbox(F.CV_CYANOTIC)} disabled={disabled} />
            <CB name={F.CV_MOTTLED} label="Mottled" checked={checkboxValues[F.CV_MOTTLED]} onChange={handleCheckbox(F.CV_MOTTLED)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Edema
            </Typography>
            <CB name={F.CV_EDEMA_ABSENT} label="Absent" checked={checkboxValues[F.CV_EDEMA_ABSENT]} onChange={handleCheckbox(F.CV_EDEMA_ABSENT)} disabled={disabled} />
            <CB name={F.CV_EDEMA_PRESENT} label="Present" checked={checkboxValues[F.CV_EDEMA_PRESENT]} onChange={handleCheckbox(F.CV_EDEMA_PRESENT)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Pulses
            </Typography>
            <CB name={F.CV_PULSES_CYANOTIC} label="Cyanotic" checked={checkboxValues[F.CV_PULSES_CYANOTIC]} onChange={handleCheckbox(F.CV_PULSES_CYANOTIC)} disabled={disabled} />
            <CB name={F.CV_PULSES_MOTTLED} label="Mottled" checked={checkboxValues[F.CV_PULSES_MOTTLED]} onChange={handleCheckbox(F.CV_PULSES_MOTTLED)} disabled={disabled} />
          </CheckboxSection>
        </Grid>

        {/* URINARY */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Urinary">
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Urine
            </Typography>
            <CB name={F.UR_NO_UTI} label="No UTI" checked={checkboxValues[F.UR_NO_UTI]} onChange={handleCheckbox(F.UR_NO_UTI)} disabled={disabled} />
            <CB name={F.UR_UTI_SYMPTOMS} label="UTI Symptoms" checked={checkboxValues[F.UR_UTI_SYMPTOMS]} onChange={handleCheckbox(F.UR_UTI_SYMPTOMS)} disabled={disabled} />
            <CB name={F.UR_DECREASED_AMOUNT} label="Decreased Amount" checked={checkboxValues[F.UR_DECREASED_AMOUNT]} onChange={handleCheckbox(F.UR_DECREASED_AMOUNT)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Method
            </Typography>
            <CB name={F.UR_CONTINENT} label="Continent" checked={checkboxValues[F.UR_CONTINENT]} onChange={handleCheckbox(F.UR_CONTINENT)} disabled={disabled} />
            <CB name={F.UR_DIAPER} label="Diaper" checked={checkboxValues[F.UR_DIAPER]} onChange={handleCheckbox(F.UR_DIAPER)} disabled={disabled} />
            <CB name={F.UR_FOLEY} label="Foley" checked={checkboxValues[F.UR_FOLEY]} onChange={handleCheckbox(F.UR_FOLEY)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Eyes, Ears, Nose, Throat
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Note drainage or problems"
              value={formValues[F.EENT_NOTES] || ''}
              onChange={handleText(F.EENT_NOTES)}
              disabled={disabled}
              multiline
              rows={2}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
            />
          </CheckboxSection>
        </Grid>

        {/* TURGOR/HYDRATION */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Turgor/Hydration">
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Of Mucus Membrane
            </Typography>
            <CB name={F.TH_NORMAL} label="Normal" checked={checkboxValues[F.TH_NORMAL]} onChange={handleCheckbox(F.TH_NORMAL)} disabled={disabled} />
            <CB name={F.TH_ABNORMAL} label="Abnormal" checked={checkboxValues[F.TH_ABNORMAL]} onChange={handleCheckbox(F.TH_ABNORMAL)} disabled={disabled} />
          </CheckboxSection>

          <CheckboxSection title="Bowel Sounds">
            <CB name={F.BS_PRESENT} label="Present" checked={checkboxValues[F.BS_PRESENT]} onChange={handleCheckbox(F.BS_PRESENT)} disabled={disabled} />
            <CB name={F.BS_ABSENT} label="Absent" checked={checkboxValues[F.BS_ABSENT]} onChange={handleCheckbox(F.BS_ABSENT)} disabled={disabled} />
            <CB name={F.BS_HYPOACTIVE} label="Hypoactive" checked={checkboxValues[F.BS_HYPOACTIVE]} onChange={handleCheckbox(F.BS_HYPOACTIVE)} disabled={disabled} />
            <CB name={F.BS_HYPERACTIVE} label="Hyperactive" checked={checkboxValues[F.BS_HYPERACTIVE]} onChange={handleCheckbox(F.BS_HYPERACTIVE)} disabled={disabled} />
          </CheckboxSection>
        </Grid>

        {/* NEUROLOGICAL */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Neurological">
            <CB name={F.NEURO_ALERT} label="Alert" checked={checkboxValues[F.NEURO_ALERT]} onChange={handleCheckbox(F.NEURO_ALERT)} disabled={disabled} />
            <CB name={F.NEURO_RESPONDS_APPROPRIATELY} label="Responds Appropriately" checked={checkboxValues[F.NEURO_RESPONDS_APPROPRIATELY]} onChange={handleCheckbox(F.NEURO_RESPONDS_APPROPRIATELY)} disabled={disabled} />
            <CB name={F.NEURO_USUAL_TEMPERAMENT} label="Usual Temperament" checked={checkboxValues[F.NEURO_USUAL_TEMPERAMENT]} onChange={handleCheckbox(F.NEURO_USUAL_TEMPERAMENT)} disabled={disabled} />
            <CB name={F.NEURO_MENTALLY_DELAYED} label="Mentally Delayed" checked={checkboxValues[F.NEURO_MENTALLY_DELAYED]} onChange={handleCheckbox(F.NEURO_MENTALLY_DELAYED)} disabled={disabled} />
            <CB name={F.NEURO_PUPILS_EQUAL} label="Pupils equal / reactive" checked={checkboxValues[F.NEURO_PUPILS_EQUAL]} onChange={handleCheckbox(F.NEURO_PUPILS_EQUAL)} disabled={disabled} />
            <CB name={F.NEURO_FUSSY_IRRITABLE} label="Fussy / irritable / crying" checked={checkboxValues[F.NEURO_FUSSY_IRRITABLE]} onChange={handleCheckbox(F.NEURO_FUSSY_IRRITABLE)} disabled={disabled} />
            <CB name={F.NEURO_LETHARGIC} label="Lethargic" checked={checkboxValues[F.NEURO_LETHARGIC]} onChange={handleCheckbox(F.NEURO_LETHARGIC)} disabled={disabled} />
            <CB name={F.NEURO_COMATOSE} label="Comatose" checked={checkboxValues[F.NEURO_COMATOSE]} onChange={handleCheckbox(F.NEURO_COMATOSE)} disabled={disabled} />
            <CB name={F.NEURO_SPEECH_PROBLEM} label="Speech Problem" checked={checkboxValues[F.NEURO_SPEECH_PROBLEM]} onChange={handleCheckbox(F.NEURO_SPEECH_PROBLEM)} disabled={disabled} />
            <CB name={F.NEURO_PARALYSIS_PARESIS} label="Paralysis / paresis" checked={checkboxValues[F.NEURO_PARALYSIS_PARESIS]} onChange={handleCheckbox(F.NEURO_PARALYSIS_PARESIS)} disabled={disabled} />
            <CB name={F.NEURO_RESTLESSNESS} label="Restlessness" checked={checkboxValues[F.NEURO_RESTLESSNESS]} onChange={handleCheckbox(F.NEURO_RESTLESSNESS)} disabled={disabled} />
            <CB name={F.NEURO_CHANGE_SLEEP} label="Change in sleep routine" checked={checkboxValues[F.NEURO_CHANGE_SLEEP]} onChange={handleCheckbox(F.NEURO_CHANGE_SLEEP)} disabled={disabled} />
          </CheckboxSection>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════
          ASSESSMENT SECTIONS - Row 2
      ═══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* APPETITE */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Appetite">
            <CB name={F.APP_GOOD} label="Good" checked={checkboxValues[F.APP_GOOD]} onChange={handleCheckbox(F.APP_GOOD)} disabled={disabled} />
            <CB name={F.APP_BAD} label="Bad" checked={checkboxValues[F.APP_BAD]} onChange={handleCheckbox(F.APP_BAD)} disabled={disabled} />
            <CB name={F.APP_POOR} label="Poor" checked={checkboxValues[F.APP_POOR]} onChange={handleCheckbox(F.APP_POOR)} disabled={disabled} />
            <CB name={F.APP_WEIGHT_GAIN} label="Weight Gain" checked={checkboxValues[F.APP_WEIGHT_GAIN]} onChange={handleCheckbox(F.APP_WEIGHT_GAIN)} disabled={disabled} />
            <CB name={F.APP_WEIGHT_LOSS} label="Weight Loss" checked={checkboxValues[F.APP_WEIGHT_LOSS]} onChange={handleCheckbox(F.APP_WEIGHT_LOSS)} disabled={disabled} />
            <CB name={F.APP_NAUSEA_VOMITING} label="Nausea / Vomiting" checked={checkboxValues[F.APP_NAUSEA_VOMITING]} onChange={handleCheckbox(F.APP_NAUSEA_VOMITING)} disabled={disabled} />
          </CheckboxSection>

          <CheckboxSection title="Tube Feeding">
            <TextField
              fullWidth
              size="small"
              label="Location"
              value={formValues[F.TF_LOCATION] || ''}
              onChange={handleText(F.TF_LOCATION)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Tolerance"
              value={formValues[F.TF_TOLERANCE] || ''}
              onChange={handleText(F.TF_TOLERANCE)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Jejunum"
              value={formValues[F.TF_JEJUNUM] || ''}
              onChange={handleText(F.TF_JEJUNUM)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </CheckboxSection>
        </Grid>

        {/* RESPIRATORY */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Respiratory">
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Respiration
            </Typography>
            <CB name={F.RESP_REGULAR} label="Regular / Unlabored" checked={checkboxValues[F.RESP_REGULAR]} onChange={handleCheckbox(F.RESP_REGULAR)} disabled={disabled} />
            <CB name={F.RESP_IRREGULAR} label="Irregular" checked={checkboxValues[F.RESP_IRREGULAR]} onChange={handleCheckbox(F.RESP_IRREGULAR)} disabled={disabled} />
            <CB name={F.RESP_DYSPNEA} label="Dyspnea" checked={checkboxValues[F.RESP_DYSPNEA]} onChange={handleCheckbox(F.RESP_DYSPNEA)} disabled={disabled} />
            <CB name={F.RESP_RETRACTIONS} label="Retractions" checked={checkboxValues[F.RESP_RETRACTIONS]} onChange={handleCheckbox(F.RESP_RETRACTIONS)} disabled={disabled} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CB name={F.RESP_O2} label="O2" checked={checkboxValues[F.RESP_O2]} onChange={handleCheckbox(F.RESP_O2)} disabled={disabled} />
              <TextField
                size="small"
                label="ltrs/min"
                value={formValues[F.RESP_O2_RATE] || ''}
                onChange={handleText(F.RESP_O2_RATE)}
                disabled={disabled}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 100 }}
              />
            </Box>
            <CB name={F.RESP_NEBULIZER} label="Nebulizer Rx's" checked={checkboxValues[F.RESP_NEBULIZER]} onChange={handleCheckbox(F.RESP_NEBULIZER)} disabled={disabled} />
            <CB name={F.RESP_TRACHEOSTOMY} label="Tracheostomy" checked={checkboxValues[F.RESP_TRACHEOSTOMY]} onChange={handleCheckbox(F.RESP_TRACHEOSTOMY)} disabled={disabled} />
            <CB name={F.RESP_APNEA_MONITOR} label="Apnea Monitor" checked={checkboxValues[F.RESP_APNEA_MONITOR]} onChange={handleCheckbox(F.RESP_APNEA_MONITOR)} disabled={disabled} />
            <CB name={F.RESP_VENTILATOR} label="Ventilator" checked={checkboxValues[F.RESP_VENTILATOR]} onChange={handleCheckbox(F.RESP_VENTILATOR)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Sounds
            </Typography>
            <CB name={F.RESP_SOUNDS_CLEAR} label="Clear" checked={checkboxValues[F.RESP_SOUNDS_CLEAR]} onChange={handleCheckbox(F.RESP_SOUNDS_CLEAR)} disabled={disabled} />
            <CB name={F.RESP_SOUNDS_PHONCI} label="Phonci" checked={checkboxValues[F.RESP_SOUNDS_PHONCI]} onChange={handleCheckbox(F.RESP_SOUNDS_PHONCI)} disabled={disabled} />
            <CB name={F.RESP_SOUNDS_CRACKLES} label="Crackles" checked={checkboxValues[F.RESP_SOUNDS_CRACKLES]} onChange={handleCheckbox(F.RESP_SOUNDS_CRACKLES)} disabled={disabled} />
            <CB name={F.RESP_SOUNDS_WHEEZE} label="Wheeze" checked={checkboxValues[F.RESP_SOUNDS_WHEEZE]} onChange={handleCheckbox(F.RESP_SOUNDS_WHEEZE)} disabled={disabled} />
            <CB name={F.RESP_SOUNDS_DECREASED} label="Decreased" checked={checkboxValues[F.RESP_SOUNDS_DECREASED]} onChange={handleCheckbox(F.RESP_SOUNDS_DECREASED)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Cough
            </Typography>
            <CB name={F.RESP_NO_COUGH} label="No Cough" checked={checkboxValues[F.RESP_NO_COUGH]} onChange={handleCheckbox(F.RESP_NO_COUGH)} disabled={disabled} />
            <CB name={F.RESP_NON_PRODUCTIVE} label="Non-Productive Cough" checked={checkboxValues[F.RESP_NON_PRODUCTIVE]} onChange={handleCheckbox(F.RESP_NON_PRODUCTIVE)} disabled={disabled} />
            <CB name={F.RESP_PRODUCTIVE} label="Productive Cough" checked={checkboxValues[F.RESP_PRODUCTIVE]} onChange={handleCheckbox(F.RESP_PRODUCTIVE)} disabled={disabled} />
          </CheckboxSection>
        </Grid>

        {/* SKIN */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Skin">
            <CB name={F.SKIN_WARM} label="Warm" checked={checkboxValues[F.SKIN_WARM]} onChange={handleCheckbox(F.SKIN_WARM)} disabled={disabled} />
            <CB name={F.SKIN_HOT} label="Hot" checked={checkboxValues[F.SKIN_HOT]} onChange={handleCheckbox(F.SKIN_HOT)} disabled={disabled} />
            <CB name={F.SKIN_COOL} label="Cool" checked={checkboxValues[F.SKIN_COOL]} onChange={handleCheckbox(F.SKIN_COOL)} disabled={disabled} />
            <CB name={F.SKIN_DIAPHORETIC} label="Diaphoretic" checked={checkboxValues[F.SKIN_DIAPHORETIC]} onChange={handleCheckbox(F.SKIN_DIAPHORETIC)} disabled={disabled} />
            <CB name={F.SKIN_CLAMMY} label="Clammy" checked={checkboxValues[F.SKIN_CLAMMY]} onChange={handleCheckbox(F.SKIN_CLAMMY)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Color
            </Typography>
            <CB name={F.SKIN_COLOR_NORMAL} label="Normal" checked={checkboxValues[F.SKIN_COLOR_NORMAL]} onChange={handleCheckbox(F.SKIN_COLOR_NORMAL)} disabled={disabled} />
            <CB name={F.SKIN_COLOR_PALE} label="Pale" checked={checkboxValues[F.SKIN_COLOR_PALE]} onChange={handleCheckbox(F.SKIN_COLOR_PALE)} disabled={disabled} />
            <CB name={F.SKIN_COLOR_FLUSHED} label="Flushed" checked={checkboxValues[F.SKIN_COLOR_FLUSHED]} onChange={handleCheckbox(F.SKIN_COLOR_FLUSHED)} disabled={disabled} />
            <CB name={F.SKIN_COLOR_CYANOTIC} label="Cyanotic" checked={checkboxValues[F.SKIN_COLOR_CYANOTIC]} onChange={handleCheckbox(F.SKIN_COLOR_CYANOTIC)} disabled={disabled} />
            <CB name={F.SKIN_COLOR_JAUNDICED} label="Jaundiced" checked={checkboxValues[F.SKIN_COLOR_JAUNDICED]} onChange={handleCheckbox(F.SKIN_COLOR_JAUNDICED)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Integrity
            </Typography>
            <CB name={F.SKIN_INTACT} label="Intact" checked={checkboxValues[F.SKIN_INTACT]} onChange={handleCheckbox(F.SKIN_INTACT)} disabled={disabled} />
            <CB name={F.SKIN_ABNORMALLY_DRY} label="Abnormally Dry" checked={checkboxValues[F.SKIN_ABNORMALLY_DRY]} onChange={handleCheckbox(F.SKIN_ABNORMALLY_DRY)} disabled={disabled} />
            <CB name={F.SKIN_BRUISES_WOUNDS} label="Bruises/Open Wounds" checked={checkboxValues[F.SKIN_BRUISES_WOUNDS]} onChange={handleCheckbox(F.SKIN_BRUISES_WOUNDS)} disabled={disabled} />
            <CB name={F.SKIN_RASH} label="Rash" checked={checkboxValues[F.SKIN_RASH]} onChange={handleCheckbox(F.SKIN_RASH)} disabled={disabled} />
            <CB name={F.SKIN_REDNESS} label="Redness" checked={checkboxValues[F.SKIN_REDNESS]} onChange={handleCheckbox(F.SKIN_REDNESS)} disabled={disabled} />
            <CB name={F.SKIN_ITCHING} label="Itching" checked={checkboxValues[F.SKIN_ITCHING]} onChange={handleCheckbox(F.SKIN_ITCHING)} disabled={disabled} />
          </CheckboxSection>
        </Grid>

        {/* GASTROINTESTINAL */}
        <Grid item xs={12} sm={6} md={3}>
          <CheckboxSection title="Gastrointestinal">
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Abdomen
            </Typography>
            <CB name={F.GI_SOFT} label="Soft" checked={checkboxValues[F.GI_SOFT]} onChange={handleCheckbox(F.GI_SOFT)} disabled={disabled} />
            <CB name={F.GI_DISTENDED} label="Distended" checked={checkboxValues[F.GI_DISTENDED]} onChange={handleCheckbox(F.GI_DISTENDED)} disabled={disabled} />
            <CB name={F.GI_FIRM} label="Firm" checked={checkboxValues[F.GI_FIRM]} onChange={handleCheckbox(F.GI_FIRM)} disabled={disabled} />
            <CB name={F.GI_PAIN_COLIC} label="Pain or Colic" checked={checkboxValues[F.GI_PAIN_COLIC]} onChange={handleCheckbox(F.GI_PAIN_COLIC)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Stools
            </Typography>
            <CB name={F.GI_USUAL_COLOR} label="Usual Color" checked={checkboxValues[F.GI_USUAL_COLOR]} onChange={handleCheckbox(F.GI_USUAL_COLOR)} disabled={disabled} />
            <CB name={F.GI_CONTINENT_STOOL} label="Continent" checked={checkboxValues[F.GI_CONTINENT_STOOL]} onChange={handleCheckbox(F.GI_CONTINENT_STOOL)} disabled={disabled} />
            <CB name={F.GI_SOFT_FORM} label="Soft Form" checked={checkboxValues[F.GI_SOFT_FORM]} onChange={handleCheckbox(F.GI_SOFT_FORM)} disabled={disabled} />
            <CB name={F.GI_LOOSE_DIARRHEA} label="Loose / Diarrhea" checked={checkboxValues[F.GI_LOOSE_DIARRHEA]} onChange={handleCheckbox(F.GI_LOOSE_DIARRHEA)} disabled={disabled} />
            <CB name={F.GI_MUCUS_WATERY} label="Mucus or Watery" checked={checkboxValues[F.GI_MUCUS_WATERY]} onChange={handleCheckbox(F.GI_MUCUS_WATERY)} disabled={disabled} />
            <CB name={F.GI_CONSTIPATION} label="Constipation" checked={checkboxValues[F.GI_CONSTIPATION]} onChange={handleCheckbox(F.GI_CONSTIPATION)} disabled={disabled} />
          </CheckboxSection>

          <CheckboxSection title="Musculoskeletal">
            <CB name={F.MSK_CRAWLS_WALKS} label="Crawls/Walks per age" checked={checkboxValues[F.MSK_CRAWLS_WALKS]} onChange={handleCheckbox(F.MSK_CRAWLS_WALKS)} disabled={disabled} />
            <CB name={F.MSK_DEVELOPMENT_PROGRESS} label="Development Progress" checked={checkboxValues[F.MSK_DEVELOPMENT_PROGRESS]} onChange={handleCheckbox(F.MSK_DEVELOPMENT_PROGRESS)} disabled={disabled} />
            <CB name={F.MSK_RETRACTIONS} label="Retractions" checked={checkboxValues[F.MSK_RETRACTIONS]} onChange={handleCheckbox(F.MSK_RETRACTIONS)} disabled={disabled} />
            <CB name={F.MSK_NORMAL_TONE} label="Normal Muscle Tone" checked={checkboxValues[F.MSK_NORMAL_TONE]} onChange={handleCheckbox(F.MSK_NORMAL_TONE)} disabled={disabled} />
            <CB name={F.MSK_DELAYED_MOTOR} label="Delayed Motor Skills" checked={checkboxValues[F.MSK_DELAYED_MOTOR]} onChange={handleCheckbox(F.MSK_DELAYED_MOTOR)} disabled={disabled} />
            <CB name={F.MSK_MUSCLE_PAIN} label="Muscle Pain" checked={checkboxValues[F.MSK_MUSCLE_PAIN]} onChange={handleCheckbox(F.MSK_MUSCLE_PAIN)} disabled={disabled} />
            <CB name={F.MSK_FRACTURE_CAST} label="Fracture/Cast" checked={checkboxValues[F.MSK_FRACTURE_CAST]} onChange={handleCheckbox(F.MSK_FRACTURE_CAST)} disabled={disabled} />
            <CB name={F.MSK_CONTRACTURES} label="Contractures" checked={checkboxValues[F.MSK_CONTRACTURES]} onChange={handleCheckbox(F.MSK_CONTRACTURES)} disabled={disabled} />
            <CB name={F.MSK_JOINT_PROBLEMS} label="Joint Problems" checked={checkboxValues[F.MSK_JOINT_PROBLEMS]} onChange={handleCheckbox(F.MSK_JOINT_PROBLEMS)} disabled={disabled} />
            <CB name={F.MSK_GEN_WEAKNESS} label="Generalized Weakness" checked={checkboxValues[F.MSK_GEN_WEAKNESS]} onChange={handleCheckbox(F.MSK_GEN_WEAKNESS)} disabled={disabled} />
            <CB name={F.MSK_MUSCLE_WEAKNESS} label="Muscle Weakness" checked={checkboxValues[F.MSK_MUSCLE_WEAKNESS]} onChange={handleCheckbox(F.MSK_MUSCLE_WEAKNESS)} disabled={disabled} />
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <TextField size="small" label="LUE" value={formValues[F.MSK_LUE] || ''} onChange={handleText(F.MSK_LUE)} disabled={disabled} InputLabelProps={{ shrink: true }} sx={{ width: '48%' }} />
              <TextField size="small" label="RUE" value={formValues[F.MSK_RUE] || ''} onChange={handleText(F.MSK_RUE)} disabled={disabled} InputLabelProps={{ shrink: true }} sx={{ width: '48%' }} />
              <TextField size="small" label="LLE" value={formValues[F.MSK_LLE] || ''} onChange={handleText(F.MSK_LLE)} disabled={disabled} InputLabelProps={{ shrink: true }} sx={{ width: '48%' }} />
              <TextField size="small" label="RLE" value={formValues[F.MSK_RLE] || ''} onChange={handleText(F.MSK_RLE)} disabled={disabled} InputLabelProps={{ shrink: true }} sx={{ width: '48%' }} />
            </Box>
          </CheckboxSection>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════
          VITAL SIGNS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: '#fff',
            bgcolor: '#1e3a5f',
            px: 1,
            py: 0.5,
            mb: 2,
            fontSize: '0.85rem',
          }}
        >
          Vital Signs
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Temperature"
              value={formValues[F.VS_TEMPERATURE] || ''}
              onChange={handleText(F.VS_TEMPERATURE)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              label="(O R A) PULSE"
              value={formValues[F.VS_PULSE] || ''}
              onChange={handleText(F.VS_PULSE)}
              disabled={disabled}
              helperText="Oral/Rectal/Axillary"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              label="(Apical Rad Brach) RESP"
              value={formValues[F.VS_RESP] || ''}
              onChange={handleText(F.VS_RESP)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              label="BP"
              value={formValues[F.VS_BP] || ''}
              onChange={handleText(F.VS_BP)}
              disabled={disabled}
              placeholder="e.g., 120/80"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              label="WT"
              value={formValues[F.VS_WT] || ''}
              onChange={handleText(F.VS_WT)}
              disabled={disabled}
              placeholder="Weight"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              size="small"
              label="HT"
              value={formValues[F.VS_HT] || ''}
              onChange={handleText(F.VS_HT)}
              disabled={disabled}
              placeholder="Height"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          NOTES
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: '#fff',
            bgcolor: '#1e3a5f',
            px: 1,
            py: 0.5,
            mb: 2,
            fontSize: '0.85rem',
          }}
        >
          Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional Notes"
          value={formValues[F.NOTES] || ''}
          onChange={handleText(F.NOTES)}
          disabled={disabled}
          placeholder="Enter any additional observations or notes..."
          InputLabelProps={{ shrink: true }}
        />
      </Paper>
    </Box>
  );
};

export default InfantChildAssessmentLayout;
