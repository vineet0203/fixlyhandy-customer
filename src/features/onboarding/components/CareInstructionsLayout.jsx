/**
 * CareInstructionsLayout.jsx
 *
 * Custom form layout for "400-Care Instructions_TX.pdf"
 * Comprehensive care instructions checklist form.
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Header
  NAME: 'NAME',
  DOB: 'DOB',
};

// ─── Care Instruction Items by Category ─────────────────────────────────
// IDs must match exact PDF field names: {Category}{Number} for checkbox, {Category}Comments{Number} for text
const CARE_CATEGORIES = {
  ASSESSMENT: {
    title: 'ASSESSMENT',
    items: [
      { id: 'Assessment1', freqId: 'AssessmentComments1', label: 'Measure & record intake/output' },
      { id: 'Assessment2', freqId: 'AssessmentComments2', label: 'Measure blood glucose' },
      { id: 'Assessment3', freqId: 'AssessmentComments3', label: 'Measure pulse' },
      { id: 'Assessment4', freqId: 'AssessmentComments4', label: 'Monitor & record BM' },
      { id: 'Assessment5', freqId: 'AssessmentComments5', label: 'Monitor & record food intake' },
      { id: 'Assessment6', freqId: 'AssessmentComments6', label: 'Monitor blood pressure' },
      { id: 'Assessment7', freqId: 'AssessmentComments7', label: 'Monitor respirations' },
      { id: 'Assessment8', freqId: 'AssessmentComments8', label: 'Take temperature' },
      { id: 'Assessment9', freqId: 'AssessmentComments9', label: 'Weigh client' },
    ],
  },
  ACTIVITY_COMFORT: {
    title: 'ACTIVITY & COMFORT',
    items: [
      { id: 'Activity1', freqId: 'ActivityComments1', label: 'Accompany on outings' },
      { id: 'Activity2', freqId: 'ActivityComments2', label: 'Drive client – seat belt on' },
      { id: 'Activity3', freqId: 'ActivityComments3', label: 'Encourage independence' },
      { id: 'Activity4', freqId: 'ActivityComments4', label: 'Encourage verbalization' },
      { id: 'Activity5', freqId: 'ActivityComments5', label: 'Give companionship' },
      { id: 'Activity6', freqId: 'ActivityComments6', label: 'Handle petty cash' },
      { id: 'Activity7', freqId: 'ActivityComments7', label: 'Pick up mail' },
      { id: 'Activity8', freqId: 'ActivityComments8', label: 'Provide diversional activities' },
      { id: 'Activity9', freqId: 'ActivityComments9', label: 'Provide emotional support' },
      { id: 'Activity10', freqId: 'ActivityComments10', label: 'Reorient to place/person' },
    ],
  },
  ELIMINATION: {
    title: 'ELIMINATION',
    items: [
      { id: 'Elimination1', freqId: 'EliminationComments1', label: 'Care for condom catheter' },
      { id: 'Elimination2', freqId: 'EliminationComments2', label: 'Care for indwelling catheter' },
      { id: 'Elimination3', freqId: 'EliminationComments3', label: 'Care for ostomy' },
      { id: 'Elimination4', freqId: 'EliminationComments4', label: 'Give digital stimulation' },
      { id: 'Elimination5', freqId: 'EliminationComments5', label: 'Give enema' },
      { id: 'Elimination6', freqId: 'EliminationComments6', label: 'Insert suppository' },
      { id: 'Elimination7', freqId: 'EliminationComments7', label: 'Irrigate colostomy' },
      { id: 'Elimination8', freqId: 'EliminationComments8', label: 'Provide incontinence care' },
      { id: 'Elimination9', freqId: 'EliminationComments9', label: 'Provide perineal care' },
      { id: 'Elimination10', freqId: 'EliminationComments10', label: 'Remove impaction' },
      { id: 'Elimination11', freqId: 'EliminationComments11', label: 'Toilet with bedpan' },
      { id: 'Elimination12', freqId: 'EliminationComments12', label: 'Toilet with commode' },
      { id: 'Elimination13', freqId: 'EliminationComments13', label: 'Toilet with urinal' },
    ],
  },
  PERSONAL_CARE: {
    title: 'PERSONAL CARE',
    items: [
      { id: 'PersonalCare1', freqId: 'PersonalCareComments1', label: 'Assist with changing clothes' },
      { id: 'PersonalCare2', freqId: 'PersonalCareComments2', label: 'Care for dentures' },
      { id: 'PersonalCare3', freqId: 'PersonalCareComments3', label: 'Give back rub' },
      { id: 'PersonalCare4', freqId: 'PersonalCareComments4', label: 'Give bed bath' },
      { id: 'PersonalCare5', freqId: 'PersonalCareComments5', label: 'Give shampoo' },
      { id: 'PersonalCare6', freqId: 'PersonalCareComments6', label: 'Give shower/tub bath' },
      { id: 'PersonalCare7', freqId: 'PersonalCareComments7', label: 'Groom hair' },
      { id: 'PersonalCare8', freqId: 'PersonalCareComments8', label: 'Provide foot care' },
      { id: 'PersonalCare9', freqId: 'PersonalCareComments9', label: 'Provide oral care' },
      { id: 'PersonalCare10', freqId: 'PersonalCareComments10', label: 'Provide skin care' },
      { id: 'PersonalCare11', freqId: 'PersonalCareComments11', label: 'Shave client' },
      { id: 'PersonalCare12', freqId: 'PersonalCareComments12', label: 'Stand-by assist while bathing' },
    ],
  },
  MEDICATIONS: {
    title: 'MEDICATIONS',
    items: [
      { id: 'Medications1', freqId: 'MedicationsComments1', label: 'Count controlled drugs' },
      { id: 'Medications2', freqId: 'MedicationsComments2', label: 'Remind/assist with medications' },
    ],
  },
  HOUSEKEEPING: {
    title: 'HOUSEKEEPING',
    items: [
      { id: 'Housekeeping1', freqId: 'HousekeepingComments1', label: 'Change linens' },
      { id: 'Housekeeping2', freqId: 'HousekeepingComments2', label: 'Clean bathroom/kitchen' },
      { id: 'Housekeeping3', freqId: 'HousekeepingComments3', label: 'Clean dishes/counter tops' },
      { id: 'Housekeeping4', freqId: 'HousekeepingComments4', label: 'Deposit trash' },
      { id: 'Housekeeping5', freqId: 'HousekeepingComments5', label: 'Dust' },
      { id: 'Housekeeping6', freqId: 'HousekeepingComments6', label: 'Empty, clean & disinfect commode' },
      { id: 'Housekeeping7', freqId: 'HousekeepingComments7', label: 'Feed pet' },
      { id: 'Housekeeping8', freqId: 'HousekeepingComments8', label: 'Make occupied bed' },
      { id: 'Housekeeping9', freqId: 'HousekeepingComments9', label: 'Make unoccupied bed' },
      { id: 'Housekeeping10', freqId: 'HousekeepingComments10', label: 'Straighten bedroom' },
      { id: 'Housekeeping11', freqId: 'HousekeepingComments11', label: 'Straighten living room' },
      { id: 'Housekeeping12', freqId: 'HousekeepingComments12', label: 'Vacuum/sweep/mop' },
      { id: 'Housekeeping13', freqId: 'HousekeepingComments13', label: 'Wash, dry & fold laundry' },
      { id: 'Housekeeping14', freqId: 'HousekeepingComments14', label: 'Water plants' },
    ],
  },
  MOBILITY: {
    title: 'MOBILITY',
    items: [
      { id: 'Mobility1', freqId: 'MobilityComments1', label: 'Assist with active/passive ROM' },
      { id: 'Mobility2', freqId: 'MobilityComments2', label: 'Assist with ambulating' },
      { id: 'Mobility3', freqId: 'MobilityComments3', label: 'Assist with walker/cane' },
      { id: 'Mobility4', freqId: 'MobilityComments4', label: 'Encourage exercise' },
      { id: 'Mobility5', freqId: 'MobilityComments5', label: 'Keep on bed rest' },
      { id: 'Mobility6', freqId: 'MobilityComments6', label: 'Transfer – max assist' },
      { id: 'Mobility7', freqId: 'MobilityComments7', label: 'Transfer – min/mod assist' },
      { id: 'Mobility8', freqId: 'MobilityComments8', label: 'Transfer – using Hoyer lift' },
      { id: 'Mobility9', freqId: 'MobilityComments9', label: 'Transfer – using transfer board' },
      { id: 'Mobility10', freqId: 'MobilityComments10', label: 'Turn & position in bed' },
      { id: 'Mobility11', freqId: 'MobilityComments11', label: 'Use wheelchair' },
    ],
  },
  NUTRITION_FLUIDS: {
    title: 'NUTRITION & FLUIDS',
    items: [
      { id: 'Nutrition1', freqId: 'NutritionComments1', label: 'Encourage fluids' },
      { id: 'Nutrition2', freqId: 'NutritionComments2', label: 'Feed via G-tube' },
      { id: 'Nutrition3', freqId: 'NutritionComments3', label: 'Feed via mouth' },
      { id: 'Nutrition4', freqId: 'NutritionComments4', label: 'Limit fluids' },
      { id: 'Nutrition5', freqId: 'NutritionComments5', label: 'Plan, prepare & setup meals/snacks' },
      { id: 'Nutrition6', freqId: 'NutritionComments6', label: 'Provide food supplement' },
      { id: 'Nutrition7', freqId: 'NutritionComments7', label: 'Shop for groceries' },
    ],
  },
  SPECIALTY_CARE: {
    title: 'SPECIALTY CARE',
    items: [
      { id: 'Specialty1', freqId: 'SpecialtyComments1', label: 'Change wound dressing' },
      { id: 'Specialty2', freqId: 'SpecialtyComments2', label: 'Monitor oxygen use' },
      { id: 'Specialty3', freqId: 'SpecialtyComments3', label: 'Provide stay-awake monitoring' },
      { id: 'Specialty4', freqId: 'SpecialtyComments4', label: 'Provide stay-over monitoring' },
      { id: 'Specialty5', freqId: 'SpecialtyComments5', label: 'Suction oral cavity' },
    ],
  },
  SAFETY_PRECAUTIONS: {
    title: 'SAFETY PRECAUTIONS',
    items: [
      { id: 'Safety1', freqId: 'SafetyComments1', label: 'Follow bleeding precautions' },
      { id: 'Safety2', freqId: 'SafetyComments2', label: 'Follow falling precautions' },
      { id: 'Safety3', freqId: 'SafetyComments3', label: 'Follow fragile skin precautions' },
      { id: 'Safety4', freqId: 'SafetyComments4', label: 'Follow swallowing precautions' },
      { id: 'Safety5', freqId: 'SafetyComments5', label: 'Follow universal precautions' },
      { id: 'Safety6', freqId: 'SafetyComments6', label: 'Supervise client safety' },
    ],
  },
  RECORDS_REPORTING: {
    title: 'RECORDS & REPORTING',
    items: [
      { id: 'Records1', freqId: 'RecordsComments1', label: 'Do Shift Report' },
      { id: 'Records2', freqId: 'RecordsComments2', label: 'Read Additional Care Guidelines' },
      { id: 'Records3', freqId: 'RecordsComments3', label: 'Record PRN med assistance' },
    ],
  },
};

/**
 * Auto-sync mapping
 */
export const CARE_INSTRUCTIONS_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const CategorySection = ({
  category,
  checkboxValues,
  formValues,
  onCheckboxChange,
  onFormChange,
  disabled,
}) => (
  <Paper elevation={1} sx={{ mb: 2 }}>
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 700,
        color: '#fff',
        bgcolor: '#1e3a5f',
        px: 1.5,
        py: 0.75,
        fontSize: '0.8rem',
      }}
    >
      {category.title}
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell sx={{ width: '50%', fontWeight: 600, fontSize: '0.75rem' }}>Task</TableCell>
            <TableCell sx={{ width: '50%', fontWeight: 600, fontSize: '0.75rem' }}>Frequency/Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {category.items.map((item) => (
            <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
              <TableCell sx={{ py: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkboxValues[item.id]}
                      onChange={(e) => onCheckboxChange({ ...checkboxValues, [item.id]: e.target.checked })}
                      disabled={disabled}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {item.label}
                    </Typography>
                  }
                  sx={{ m: 0 }}
                />
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={formValues[item.freqId] || ''}
                  onChange={(e) => onFormChange({ ...formValues, [item.freqId]: e.target.value })}
                  disabled={disabled}
                  placeholder="Frequency/Comments"
                  InputProps={{ sx: { fontSize: '0.75rem' } }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

// ─── Main Component ─────────────────────────────────────────────────────

const CareInstructionsLayout = ({
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

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}>
          Care Instructions
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CLIENT INFO
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="NAME"
              value={formValues[F.NAME] || ''}
              onChange={handleText(F.NAME)}
              disabled={disabled}
              placeholder="Enter client's full name"
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
              helperText="Date of birth"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CARE INSTRUCTION CATEGORIES
      ═══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <CategorySection
            category={CARE_CATEGORIES.ASSESSMENT}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.ACTIVITY_COMFORT}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.ELIMINATION}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.PERSONAL_CARE}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.MEDICATIONS}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <CategorySection
            category={CARE_CATEGORIES.HOUSEKEEPING}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.MOBILITY}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.NUTRITION_FLUIDS}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.SPECIALTY_CARE}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.SAFETY_PRECAUTIONS}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
          <CategorySection
            category={CARE_CATEGORIES.RECORDS_REPORTING}
            checkboxValues={checkboxValues}
            formValues={formValues}
            onCheckboxChange={onCheckboxChange}
            onFormChange={onFormChange}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CareInstructionsLayout;
