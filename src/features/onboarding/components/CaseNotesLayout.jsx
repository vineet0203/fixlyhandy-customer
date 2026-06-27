/**
 * CaseNotesLayout.jsx
 *
 * Custom form layout for "7054-Case Notes_TX.pdf"
 * Simple case notes form with note entries table.
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
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// ─── PDF field name constants ────────────────────────────────────────────
const F = {
  // Header
  CLIENT_ID: 'Client ID',
  CLIENT_NAME: 'Client Name',
  CLIENT_DOB: 'Client DOB',
  REP_NAME_TITLE: 'Rep Name/Title',
};

/**
 * Auto-sync mapping
 */
export const CASE_NOTES_AUTO_SYNC = {};

// ─── Sub-components ─────────────────────────────────────────────────────

// ─── Main Component ─────────────────────────────────────────────────────

const CaseNotesLayout = ({
  formValues = {},
  checkboxValues = {},
  onFormChange,
  onCheckboxChange,
  disabled = false,
}) => {
  // ── Initialize notes array if not present ──
  const notes = formValues.caseNotes || [{ id: 1, date: '', time: '', notes: '' }];

  // ── Handlers ──
  const handleText = (fieldName) => (e) => {
    onFormChange({ ...formValues, [fieldName]: e.target.value });
  };

  const handleNoteChange = (noteId, field, value) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, [field]: value } : note
    );
    onFormChange({ ...formValues, caseNotes: updatedNotes });
  };

  const addNote = () => {
    const newId = Math.max(...notes.map((n) => n.id)) + 1;
    const updatedNotes = [...notes, { id: newId, date: '', time: '', notes: '' }];
    onFormChange({ ...formValues, caseNotes: updatedNotes });
  };

  const removeNote = (noteId) => {
    if (notes.length <= 1) return; // Keep at least one row
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    onFormChange({ ...formValues, caseNotes: updatedNotes });
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 1 }}>
          Case Notes
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Mastercare Homecare & Healthcare
        </Typography>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CLIENT INFO
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a5f', mb: 2 }}>
          Client Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Client ID"
              value={formValues[F.CLIENT_ID] || ''}
              onChange={handleText(F.CLIENT_ID)}
              disabled={disabled}
              placeholder="Enter Client ID"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Client DOB"
              value={formValues[F.CLIENT_DOB] || ''}
              onChange={handleText(F.CLIENT_DOB)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Rep Name/Title"
              value={formValues[F.REP_NAME_TITLE] || ''}
              onChange={handleText(F.REP_NAME_TITLE)}
              disabled={disabled}
              placeholder="Enter representative name and title"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ═══════════════════════════════════════════════════════════════════
          CASE NOTES TABLE
      ═══════════════════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3a5f' }}>
            Case Notes Entries
          </Typography>
          {!disabled && (
            <IconButton
              color="primary"
              onClick={addNote}
              size="small"
              sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1e3a5f' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, width: '15%' }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, width: '15%' }}>Time</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Notes</TableCell>
                {!disabled && (
                  <TableCell sx={{ color: '#fff', fontWeight: 600, width: '60px', textAlign: 'center' }}>
                    Action
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note, index) => (
                <TableRow key={note.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      value={note.date || ''}
                      onChange={(e) => handleNoteChange(note.id, 'date', e.target.value)}
                      disabled={disabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      value={note.time || ''}
                      onChange={(e) => handleNoteChange(note.id, 'time', e.target.value)}
                      disabled={disabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      value={note.notes || ''}
                      onChange={(e) => handleNoteChange(note.id, 'notes', e.target.value)}
                      disabled={disabled}
                      placeholder="Enter case notes..."
                    />
                  </TableCell>
                  {!disabled && (
                    <TableCell sx={{ py: 1, textAlign: 'center' }}>
                      <IconButton
                        color="error"
                        onClick={() => removeNote(note.id)}
                        size="small"
                        disabled={notes.length <= 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
          Click the + button to add more note entries. Each entry should include date, time, and detailed notes.
        </Typography>
      </Paper>

      {/* Note: This template (790-Case Notes-TX.pdf) contains no signature fields.
          The form only captures Date/Time/Notes table entries. */}
    </Box>
  );
};

export default CaseNotesLayout;
