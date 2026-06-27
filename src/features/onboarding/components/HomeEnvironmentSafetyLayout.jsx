/**
 * HomeEnvironmentSafetyLayout.jsx
 *
 * Custom form layout for "7050-Home Environment Safety Checklist_TX.pdf"
 * Comprehensive home safety assessment with Y/N/R checkboxes.
 * 
 * PDF field names extracted from actual template.
 */
import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants (from actual PDF) ────────────────────────────────────────────
const F = {
  // Header text fields
  SAFETY_CHECK_BY: 'Safety Check By',
  DATE: 'Date',
  CLIENT_NAME: 'Client Name',
  ADDRESS: 'Address',
  TELEPHONE: 'Telephone',
  EMERGENCY_CONTACT: 'Emergency Contact',

  // Comments
  COMMENTS: 'Comments',
  OTHER_PROBLEMS: 'If yes list the problems',
  PETS_OTHER: 'Pets Other',

  // Signatures
  CLIENT_SIGNATURE: 'Signature75_es_:signer:signature',
  CLIENT_DATE: 'Date_2',
  REP_SIGNATURE: 'Signature76_es_:signer:signature',
  REP_DATE: 'Date_3',
};

// ─── Checkbox field mappings (actual PDF field names) ────────────────────────────
const SAFETY_ITEMS = [
  // Stairs or Steps Check (rows 1-4)
  { label: 'Lighting', y: 'StairsY1', n: 'StairsN1', r: 'StairsR1', section: 'Stairs or Steps Check' },
  { label: 'Inside the home', y: 'StairsY2', n: 'StairsN2', r: 'StairsR2' },
  { label: 'Into home', y: 'StairsY3', n: 'StairsN3', r: 'StairsR3' },
  { label: 'Handrails', y: 'StairsY4', n: 'StairsN14', r: 'StairsR4' }, // Note: PDF has StairsN14
  
  // Carpets Check (rows 1-3)
  { label: 'Is it loose?', y: 'CarpetY1', n: 'CarpetN1', r: 'CarpetR1', section: 'Carpets Check' },
  { label: 'Is it worn?', y: 'CarpetY2', n: 'CarpetN2', r: 'CarpetR2' },
  { label: 'Throw rugs', y: 'CarpetY3', n: 'CarpetN3', r: 'CarpetR3' },
  
  // Furniture Check (rows 1-2)
  { label: 'Are they unstable?', y: 'Furniture1', n: 'FurnitureN1', r: 'FurnitureR1', section: 'Furniture Check' }, // Note: PDF has Furniture1 not FurnitureY1
  { label: 'Anything unusual?', y: 'furnitureY2', n: 'FurnitureN2', r: 'FurnitureR2' }, // Note: lowercase furnitureY2
  
  // Bathroom Check (rows 1-6)
  { label: 'Lighting', y: 'BathroomY1', n: 'BathroomN1', r: 'BathroomR1', section: 'Bathroom Check' },
  { label: 'Bathtub & shower areas', y: 'BathroomY2', n: 'BathroomN2', r: 'BathroomR2' },
  { label: 'Water temperature', y: 'BathroomY3', n: 'BathroomN3', r: 'BathroomR3' },
  { label: 'Grab bars', y: 'BathroomY4', n: 'BathroomN4', r: 'BathroomR4' },
  { label: 'How is the accessibility?', y: 'BathroomY5', n: 'BathroomN5', r: 'BathroomR5' },
  { label: 'Small electric appliances', y: 'BathroomY6', n: 'BathroomN6', r: 'BathroomR6' },
  
  // Bedroom Check (rows 1-3)
  { label: 'Lighting', y: 'BedroomY1', n: 'BedroomN1', r: 'BedroomR1', section: 'Bedroom Check' },
  { label: 'Bedrails', y: 'BedroomY2', n: 'BedroomN2', r: 'BedroomR2' },
  { label: 'Around the bed', y: 'BedroomY3', n: 'BedroomN3', r: 'BedroomR3' },
  
  // Kitchen Check (rows 1-6)
  { label: 'Lighting', y: 'KitchenY1', n: 'KitchenN1', r: 'KitchenR1', section: 'Kitchen Check' },
  { label: 'The stove / range area', y: 'KitchenY2', n: 'KitchenN2', r: 'KitchenR2' },
  { label: 'The telephone area', y: 'KitchenY3', n: 'KitchenN3', r: 'KitchenR3' },
  { label: 'The electrical cords', y: 'KitchenY4', n: 'KitchenN4', r: 'KitchenR4' },
  { label: 'The stepstool', y: 'KitchenY5', n: 'KitchenN5', r: 'KitchenR5' },
  { label: 'The floors', y: 'KitchenY6', n: 'KitchenN6', r: 'KitchenR6' },
  
  // Living/Family Room Check (rows 1-3)
  { label: 'Fireplace & chimney', y: 'LivingY1', n: 'LivingN1', r: 'LivingR1', section: 'Living/Family Room Check' },
  { label: 'The telephone area', y: 'LivingY2', n: 'LivingN2', r: 'LivingR2' },
  { label: 'Passageways', y: 'LivingY3', n: 'LivingN3', r: 'LivingR3' },
  
  // Basement/Garage/Workshop/Storage Check (rows 1-4)
  { label: 'Lighting', y: 'BasementY1', n: 'BasementN1', r: 'BasementR1', section: 'Basement/Garage/Workshop' },
  { label: 'Fuse box / circuit breakers', y: 'BasementY2', n: 'BasementN2', r: 'BasementR2' },
  { label: 'Appliances and power tools', y: 'BasementY3', n: 'BasementN3', r: 'BasementR3' },
  { label: 'Flammable/volatile liquids', y: 'BasementY4', n: 'BasementN4', r: 'BasementR4' },
  
  // Pets (rows 1-3) - Note: Pets doesn't have R column in PDF
  { label: 'Cats', y: 'PetsY1', n: 'PetsN1', r: null, section: 'Pets' },
  { label: 'Dogs', y: 'PetsY2', n: 'PetsN2', r: null },
  { label: 'Other:', y: 'PetsY3', n: 'PetsN3', r: null, hasTextField: true },
  
  // Fire Safety Check (rows 1-10)
  { label: 'Fire Extinguisher', y: 'FireY1', n: 'FireN1', r: 'FireR1', section: 'Fire Safety Check' },
  { label: 'Check all rug runners & mats', y: 'FireY2', n: 'FireN2', r: 'FireR2' },
  { label: 'Check cords', y: 'FireY3', n: 'FireN3', r: 'FireR3' },
  { label: 'Check the telephone area', y: 'FireY4', n: 'FireN4', r: 'FireR4' },
  { label: 'Check smoke detectors', y: 'FireY5', n: 'FireN5', r: 'FireR5' },
  { label: 'Electrical outlets, switches, bulbs', y: 'FireY6', n: 'FireN6', r: 'FireR6' },
  { label: 'Flammable clothing/material', y: 'FireY7', n: 'FireN7', r: 'FireR7' },
  { label: 'Space heaters', y: 'FireY8', n: 'FireN8', r: 'FireR8' },
  { label: 'Wood-burning heaters', y: 'FireY9', n: 'FireN9', r: 'FireR9' },
  { label: 'Review emergency exit plan', y: 'FireY10', n: 'FireN10', r: 'FireR10' },
  
  // Fire Safety Plan (rows 1-3)
  { label: 'Install smoke detector on each level', y: 'FirePlanY1', n: 'FirePlanN1', r: 'FirePlanR1', section: 'Fire Safety Plan' },
  { label: 'Two escape routes from rooms', y: 'FirePlanY2', n: 'FirePlanN2', r: 'FirePlanR2' },
  { label: 'Emergency escape route/drills', y: 'FirePlanY3', n: 'FirePlanN3', r: 'FirePlanR3' },
  
  // Home Equipment Safety (rows 1-7)
  { label: 'Walker', y: 'EquipmentY1', n: 'EquipmentN1', r: 'EquipmentR1', section: 'Home Equipment Safety' },
  { label: 'Wheelchair', y: 'EquipmentY2', n: 'EquipmentN2', r: 'EquipmentR2' },
  { label: 'Commode', y: 'EquipmentY3', n: 'EquipmentN3', r: 'EquipmentR3' },
  { label: 'Grab bars', y: 'EquipmentY4', n: 'EquipmentN4', r: 'EquipmentR4' },
  { label: 'Wheelchair ramp', y: 'EquipmentY5', n: 'EquipmentN5', r: 'EquipmentR5' },
  { label: 'Cane', y: 'EquipmentY6', n: 'EquipmentN6', r: 'EquipmentR6' },
  { label: 'Hospital bed', y: 'EquipmentY7', n: 'EquipmentN7', r: 'EquipmentR7' },
  
  // Pests (rows 1-2)
  { label: 'Check for insects', y: 'PestsY1', n: 'PestsN1', r: 'PestsR1', section: 'Pests' },
  { label: 'Check for rodents', y: 'PestsY2', n: 'PestsN2', r: 'PestsR2' },
  
  // Structural Check (rows 1-6)
  { label: 'Narrow doorways', y: 'StructuralY1', n: 'StructuralN1', r: 'StructuralR1', section: 'Structural Check' },
  { label: 'Uneven floors', y: 'StructuralY2', n: 'StructuralN2', r: 'StructuralR2' },
  { label: 'Walking surfaces', y: 'StructuralY3', n: 'StructuralN3', r: 'StructuralR3' },
  { label: 'Check accessibility', y: 'StructuralY4', n: 'StructuralN4', r: 'StructuralR4' },
  { label: 'Telephone cords', y: 'StructuralY5', n: 'StructuralN5', r: 'StructuralR5' },
  { label: 'Electrical cords', y: 'StructuralY6', n: 'StructuralN6', r: 'StructuralR6' },
  
  // Personal Belongings (rows 1-3)
  { label: 'Check if in safe place', y: 'PersonalY1', n: 'PersonalN1', r: 'PersonalR1', section: 'Personal Belongings' },
  { label: 'Check if too accessible', y: 'PersonalY2', n: 'PersonalN2', r: 'PersonalR2' },
  { label: 'Advice given re: safe placement', y: 'PersonalY3', n: 'PersonalN3', r: 'PersonalR3' },
];

/**
 * Auto-sync mapping
 */
export const HOME_ENVIRONMENT_SAFETY_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

const CB = ({ name, checked, onChange, disabled }) => {
  if (!name) return <Box sx={{ width: 24, height: 24 }} />; // Empty spacer for null fields
  return (
    <Checkbox
      checked={checked || false}
      onChange={(e) => onChange(name, e.target.checked)}
      disabled={disabled}
      size="small"
      sx={{ 
        p: 0.25,
        '&.Mui-checked': { color: '#1e3a5f' }
      }}
    />
  );
};

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

const HomeEnvironmentSafetyLayout = ({
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

  const handleCheckbox = (fieldName, checked) => {
    onCheckboxChange({ ...checkboxValues, [fieldName]: checked });
  };

  const handleSignature = (fieldName) => (dataUrl) => {
    onSignatureChange({ ...signatureValues, [fieldName]: dataUrl });
  };

  // Group items by section
  const groupedItems = SAFETY_ITEMS.reduce((acc, item) => {
    if (item.section) {
      acc.push({ section: item.section, items: [item] });
    } else if (acc.length > 0) {
      acc[acc.length - 1].items.push(item);
    }
    return acc;
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}>
          Home Environment Safety Checklist
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
              label="Safety Check Performed By"
              value={formValues[F.SAFETY_CHECK_BY] || ''}
              onChange={handleText(F.SAFETY_CHECK_BY)}
              disabled={disabled}
              placeholder="Name of person performing check"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
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
              label="Telephone"
              value={formValues[F.TELEPHONE] || ''}
              onChange={handleText(F.TELEPHONE)}
              disabled={disabled}
              placeholder="(XXX) XXX-XXXX"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Emergency Contact"
              value={formValues[F.EMERGENCY_CONTACT] || ''}
              onChange={handleText(F.EMERGENCY_CONTACT)}
              disabled={disabled}
              placeholder="Emergency contact name & phone"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          LEGEND
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Legend:</Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Typography variant="body2"><strong style={{ color: 'green' }}>Y</strong> = Yes / Satisfactory</Typography>
          <Typography variant="body2"><strong style={{ color: 'red' }}>N</strong> = No / Not Present</Typography>
          <Typography variant="body2"><strong style={{ color: 'orange' }}>R</strong> = Needs Repair / Attention</Typography>
        </Box>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          SAFETY CHECKLIST SECTIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1e3a5f' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, width: '50%' }}>Item</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, width: '16.6%', textAlign: 'center' }}>Y</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, width: '16.6%', textAlign: 'center' }}>N</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, width: '16.6%', textAlign: 'center' }}>R</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedItems.map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {/* Section Header */}
                  <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                    <TableCell colSpan={4} sx={{ fontWeight: 700, color: '#1e3a5f', py: 1 }}>
                      {group.section}
                    </TableCell>
                  </TableRow>
                  {/* Section Items */}
                  {group.items.map((item, itemIdx) => (
                    <TableRow 
                      key={itemIdx}
                      sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}
                    >
                      <TableCell sx={{ py: 0.5, fontSize: '0.8rem' }}>
                        {item.label}
                        {item.hasTextField && (
                          <TextField
                            size="small"
                            value={formValues[F.PETS_OTHER] || ''}
                            onChange={handleText(F.PETS_OTHER)}
                            disabled={disabled}
                            placeholder="Specify..."
                            sx={{ ml: 1, width: 150 }}
                            InputProps={{ sx: { fontSize: '0.75rem' } }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 0.5, textAlign: 'center' }}>
                        <CB 
                          name={item.y} 
                          checked={checkboxValues[item.y]} 
                          onChange={handleCheckbox}
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 0.5, textAlign: 'center' }}>
                        <CB 
                          name={item.n} 
                          checked={checkboxValues[item.n]} 
                          onChange={handleCheckbox}
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 0.5, textAlign: 'center' }}>
                        <CB 
                          name={item.r} 
                          checked={checkboxValues[item.r]} 
                          onChange={handleCheckbox}
                          disabled={disabled}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          OTHER PROBLEMS & COMMENTS
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1e3a5f' }}>
          Other Problems Apparent?
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CB 
                name="OtherY" 
                checked={checkboxValues['OtherY']} 
                onChange={handleCheckbox}
                disabled={disabled}
              />
              <Typography variant="body2">Yes</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CB 
                name="OtherN" 
                checked={checkboxValues['OtherN']} 
                onChange={handleCheckbox}
                disabled={disabled}
              />
              <Typography variant="body2">No</Typography>
            </Box>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          size="small"
          label="If yes, list the problems"
          value={formValues[F.OTHER_PROBLEMS] || ''}
          onChange={handleText(F.OTHER_PROBLEMS)}
          disabled={disabled}
          multiline
          rows={2}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1e3a5f' }}>
          Comments
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Additional comments or observations"
          value={formValues[F.COMMENTS] || ''}
          onChange={handleText(F.COMMENTS)}
          disabled={disabled}
          multiline
          rows={3}
          InputLabelProps={{ shrink: true }}
        />
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
        <SignatureSection title="Client Signature" caption="Sign below to acknowledge the safety assessment">
          <SignaturePad
            label="Client Signature - Sign here"
            value={signatureValues[F.CLIENT_SIGNATURE]}
            onChange={handleSignature(F.CLIENT_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12}>
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
        <SignatureSection title="Mastercare Representative Signature" caption="To be completed by Mastercare representative">
          <SignaturePad
            label="Representative Signature - Sign here"
            value={signatureValues[F.REP_SIGNATURE]}
            onChange={handleSignature(F.REP_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12}>
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
    </Box>
  );
};

export default HomeEnvironmentSafetyLayout;
