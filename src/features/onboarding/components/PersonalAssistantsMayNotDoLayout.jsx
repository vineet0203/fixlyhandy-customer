/**
 * PersonalAssistantsMayNotDoLayout.jsx
 *
 * Custom form layout for "324-Personal Assistants May Not Do_TX.pdf"
 * Acknowledgement form listing restrictions for personal assistants.
 */
import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import SignaturePad from './SignaturePad';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Client/Client Representative Signature Section
  CLIENT_SIGNATURE: 'Signature10_es_:signer:signature',
  CLIENT_DATE: 'Date',
  CLIENT_PRINT_NAME: 'Print Name',
  
  // Mastercare Representative Section
  REP_SIGNATURE: 'Signature11_es_:signer:signature',
  REP_DATE: 'Date_2',
  REP_PRINT_NAME: 'Print Name_2',
};

/**
 * Auto-sync mapping
 */
export const PERSONAL_ASSISTANTS_MAY_NOT_DO_AUTO_SYNC = {};

// ─── Restrictions List ─────────────────────────────────────────────────────
const RESTRICTIONS = [
  'Perform tasks not on the Care Plan',
  'Give enemas or remove impactions',
  'Foley catheter irrigation',
  'Super pubic irrigation',
  'Colostomy irrigation',
  'Decubitus care or any type of wound care',
  'Care of tracheotomy tubes / Suctioning',
  'Vaginal irrigation / Insertion of tampons',
  'Tube feeding',
  'Massage or rub legs',
  'Cut fingernails or toenails',
  'Restrain clients',
  'Change sterile dressings',
  'Give medical or legal advice',
  'Heavy lifting that does not pertain to client care',
  'Household repairs',
  'Provide care for a client\'s family members',
  'Handle checkbook or financial issues',
  'Accept gifts or extra pay from client',
  'Landscaping / yard work',
  'Smoke while on shift at a client\'s home',
  'Eat client\'s food',
  'Text or talk on the phone while on shift with a client',
  'Drive client without prior approval from Mastercare office',
  'Enter house without client present',
  'Call clients directly and cancel services or reschedule shifts',
];

// ─── Sub-components ─────────────────────────────────────────────────────

const SignatureSection = ({ title, caption, children }) => (
  <Box
    sx={{
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      p: 2,
      mb: 2.5,
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

const PersonalAssistantsMayNotDoLayout = ({
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
          What Our Personal Assistants May <em>NOT</em> Do
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          RESTRICTIONS LIST
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#c62828', 
            mb: 2,
            fontSize: '1.1rem'
          }}
        >
          Personal Assistants DO NOT:
        </Typography>
        
        <List dense sx={{ bgcolor: '#fff8f8', borderRadius: 1, p: 1 }}>
          {RESTRICTIONS.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <BlockIcon sx={{ color: '#c62828', fontSize: '1rem' }} />
              </ListItemIcon>
              <ListItemText 
                primary={item} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontSize: '0.85rem' }
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          ACKNOWLEDGEMENT
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="body2" sx={{ color: '#444', fontStyle: 'italic', lineHeight: 1.7 }}>
          I have read and understand what a Mastercare Homecare and Healthcare Personal Assistant{' '}
          <strong><u>may not do</u></strong>. If I have any questions about my service, I will contact 
          my Service Supervisor.
        </Typography>
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

        {/* Client/Client Representative Signature */}
        <SignatureSection 
          title="Client/Client Representative Signature" 
          caption="The client or their representative must sign below to acknowledge understanding"
        >
          <SignaturePad
            label="Client/Representative Signature - Sign here"
            value={signatureValues[F.CLIENT_SIGNATURE]}
            onChange={handleSignature(F.CLIENT_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.CLIENT_DATE] || ''}
                onChange={handleText(F.CLIENT_DATE)}
                disabled={disabled}
                helperText="Date of signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Print Name"
                value={formValues[F.CLIENT_PRINT_NAME] || ''}
                onChange={handleText(F.CLIENT_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter printed name"
                helperText="Full legal name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>

        {/* Mastercare Representative Signature */}
        <SignatureSection 
          title="Mastercare Representative Signature" 
          caption="To be completed by Mastercare representative"
        >
          <SignaturePad
            label="Mastercare Representative Signature - Sign here"
            value={signatureValues[F.REP_SIGNATURE]}
            onChange={handleSignature(F.REP_SIGNATURE)}
            disabled={disabled}
          />
          <Grid container spacing={2} sx={{ mt: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                value={formValues[F.REP_DATE] || ''}
                onChange={handleText(F.REP_DATE)}
                disabled={disabled}
                helperText="Date of signature"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Print Name"
                value={formValues[F.REP_PRINT_NAME] || ''}
                onChange={handleText(F.REP_PRINT_NAME)}
                disabled={disabled}
                placeholder="Enter representative's printed name"
                helperText="Representative's full name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </SignatureSection>
      </Paper>
    </Box>
  );
};

export default PersonalAssistantsMayNotDoLayout;
