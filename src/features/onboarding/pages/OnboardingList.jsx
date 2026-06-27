// features/onboarding/pages/OnboardingList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import onboardingService from '../services/onboardingService';

const statusColors = {
  pending: 'warning',
  completed: 'success',
  expired: 'error',
};

const OnboardingList = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchAssigned = useCallback(async () => {
    try {
      setLoading(true);
      const response = await onboardingService.getAssigned();
      if (response.success && response.data) {
        setAssignments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch assigned documents:', err);
      setSnackbar({ open: true, message: 'Failed to load assignments.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

  const handleDownload = async (id, customerName) => {
    try {
      const blob = await onboardingService.downloadPdf(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${customerName.replace(/\s+/g, '_')}_onboarding.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to download PDF.', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Onboarding Documents
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<RefreshIcon />} onClick={fetchAssigned} disabled={loading}>
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/onboarding/assign')}
          >
            Assign Document
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : assignments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No onboarding documents assigned yet.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/onboarding/assign')}>
            Assign Your First Document
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Template</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assigned</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Completed</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.employee_name}</TableCell>
                  <TableCell>{a.employee_email}</TableCell>
                  <TableCell>{a.template_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      color={statusColors[a.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell align="center">
                    {(a.has_pdf || a.status === 'completed') && (
                      <Tooltip title="Download completed PDF">
                        <IconButton
                          color="primary"
                          onClick={() => handleDownload(a.id, a.employee_name)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OnboardingList;
