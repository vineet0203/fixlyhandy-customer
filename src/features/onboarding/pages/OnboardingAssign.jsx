// features/onboarding/pages/OnboardingAssign.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Avatar,
  Chip,
} from '@mui/material';
import { Person, Business } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import onboardingService from '../services/onboardingService';
import { useClients } from '../../clients/hooks/useClients';

// Helper function to get client display name based on client type
const getClientDisplayName = (client) => {
  if (!client) return '';
  if (client.client_type === 'commercial') {
    return client.business_name || 'Unnamed Business';
  } else {
    const firstName = client.first_name || '';
    const lastName = client.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Client';
  }
};

const OnboardingAssign = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Use the clients hook to fetch vendor's customers
  const { clients, loadClients, loading: clientsLoading } = useClients({ limit: 100 });

  const [form, setForm] = useState({
    employee_name: '',
    employee_email: '',
    template_id: '',
    customer_id: '',
  });

  // Load templates and clients on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await onboardingService.getTemplates();
        if (response.success && response.data) {
          setTemplates(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
        setSnackbar({ open: true, message: 'Failed to load templates.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
    loadClients(1, 100); // Load all clients for dropdown
  }, [loadClients]);

  // Handle customer selection from dropdown
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    
    if (!customerId) {
      setForm({
        employee_name: '',
        employee_email: '',
        template_id: form.template_id,
        customer_id: '',
      });
      return;
    }

    // Find the selected customer using String comparison to handle type mismatch
    const selectedCustomer = clients.find(c => String(c.id) === String(customerId));
    
    if (selectedCustomer) {
      const displayName = getClientDisplayName(selectedCustomer);
      setForm({
        ...form,
        employee_name: displayName,
        employee_email: selectedCustomer.email || '',
        customer_id: customerId,
      });
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer_id || !form.template_id) {
      setSnackbar({ open: true, message: 'Please select a customer and document template.', severity: 'warning' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        employee_name: form.employee_name.trim(),
        employee_email: form.employee_email.trim(),
        template_id: Number(form.template_id),
        ...(form.customer_id ? { customer_id: Number(form.customer_id) } : {}),
      };

      const response = await onboardingService.assignDocument(payload);

      if (response.success) {
        setSnackbar({
          open: true,
          message: `Document assigned! Email sent to ${form.employee_email}.`,
          severity: 'success',
        });
        // Reset form
        setForm({ employee_name: '', employee_email: '', template_id: '', customer_id: '' });
      } else {
        setSnackbar({ open: true, message: response.message || 'Assignment failed.', severity: 'error' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign document.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/onboarding')} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Assign Onboarding Document
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Customer Selection Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth required disabled={submitting || clientsLoading}>
                <InputLabel id="customer-select-label">Select Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  id="customer-select"
                  value={form.customer_id}
                  label="Select Customer"
                  onChange={handleCustomerChange}
                  renderValue={(selected) => {
                    if (clientsLoading) {
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="body2" color="text.secondary">
                            Loading customers...
                          </Typography>
                        </Box>
                      );
                    }
                    if (!selected) return <em>Select a customer</em>;
                    const client = clients.find(c => String(c.id) === String(selected));
                    if (!client) return <em>Select a customer</em>;
                    const displayName = getClientDisplayName(client);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: client.client_type === 'commercial' ? 'primary.main' : 'warning.main',
                            color: 'white'
                          }}
                        >
                          {client.client_type === 'commercial' ? <Business fontSize="small" /> : <Person fontSize="small" />}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {displayName}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  {clientsLoading ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2">Loading customers...</Typography>
                      </Box>
                    </MenuItem>
                  ) : clients.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No customers found. Create a customer first.
                      </Typography>
                    </MenuItem>
                  ) : (
                    clients.map((client) => {
                      const displayName = getClientDisplayName(client);
                      const isCommercial = client.client_type === 'commercial';
                      return (
                        <MenuItem key={client.id} value={client.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: isCommercial ? 'primary.main' : 'warning.main',
                                color: 'white'
                              }}
                            >
                              {isCommercial ? <Business fontSize="small" /> : <Person fontSize="small" />}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {displayName}
                                </Typography>
                                <Chip
                                  label={isCommercial ? 'Commercial' : 'Residential'}
                                  size="small"
                                  color={isCommercial ? 'primary' : 'warning'}
                                  sx={{ height: 20, '& .MuiChip-label': { fontSize: '0.7rem', px: 1 } }}
                                />
                              </Box>
                              {client.email && (
                                <Typography variant="caption" color="text.secondary">
                                  {client.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                <FormHelperText>
                  {form.customer_id && form.employee_email 
                    ? `Email will be sent to: ${form.employee_email}` 
                    : 'Select a customer to send onboarding documents'}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Document Template Selection */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                select
                label="Document Template"
                value={form.template_id}
                onChange={handleChange('template_id')}
                disabled={submitting}
              >
                {templates.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={submitting || !form.customer_id || !form.template_id}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                {submitting ? 'Sending...' : 'Assign & Send Email'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OnboardingAssign;
