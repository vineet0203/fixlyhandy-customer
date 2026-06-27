// features/onboarding/pages/FillForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Snackbar,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SendIcon from '@mui/icons-material/Send';
import DynamicPdfForm from '../components/DynamicPdfForm';
import ConsentHomecareLayout, { CONSENT_AUTO_SYNC } from '../components/ConsentHomecareLayout';
import ConsentReleaseObtainLayout, { CONSENT_RELEASE_AUTO_SYNC } from '../components/ConsentReleaseObtainLayout';
import AssignmentBenefitsLayout, { ASSIGNMENT_BENEFITS_AUTO_SYNC } from '../components/AssignmentBenefitsLayout';
import AutomaticPaymentLayout, { AUTOMATIC_PAYMENT_AUTO_SYNC } from '../components/AutomaticPaymentLayout';
import PhysicalAssessmentLayout, { PHYSICAL_ASSESSMENT_AUTO_SYNC } from '../components/PhysicalAssessmentLayout';
import VehicleReleaseWaiverLayout, { VEHICLE_RELEASE_AUTO_SYNC } from '../components/VehicleReleaseWaiverLayout';
import InfantChildAssessmentLayout, { INFANT_CHILD_ASSESSMENT_AUTO_SYNC } from '../components/InfantChildAssessmentLayout';
import PersonalAssistantsMayNotDoLayout, { PERSONAL_ASSISTANTS_MAY_NOT_DO_AUTO_SYNC } from '../components/PersonalAssistantsMayNotDoLayout';
import ParticipantAgreementReleaseLayout, { PARTICIPANT_AGREEMENT_RELEASE_AUTO_SYNC } from '../components/ParticipantAgreementReleaseLayout';
import ClientHandbookAcknowledgementLayout, { CLIENT_HANDBOOK_ACK_AUTO_SYNC } from '../components/ClientHandbookAcknowledgementLayout';
import CareInstructionsLayout, { CARE_INSTRUCTIONS_AUTO_SYNC } from '../components/CareInstructionsLayout';
import CarePlanAcknowledgementLayout, { CARE_PLAN_ACK_AUTO_SYNC } from '../components/CarePlanAcknowledgementLayout';
import EmergencyPlanLayout, { EMERGENCY_PLAN_AUTO_SYNC } from '../components/EmergencyPlanLayout';
import HomeEnvironmentSafetyLayout, { HOME_ENVIRONMENT_SAFETY_AUTO_SYNC } from '../components/HomeEnvironmentSafetyLayout';
import CaseNotesLayout, { CASE_NOTES_AUTO_SYNC } from '../components/CaseNotesLayout';
import onboardingService from '../services/onboardingService';
import { extractFormFields, fillPdfForm, generateStandalonePdf, fillCaseNotesPdf } from '../utils/pdfFormFiller';

// Template names that have custom form layouts (must match backend DocumentTemplateSeeder `name` field)
const CONSENT_TEMPLATE = 'Consent for Homecare Services';
const CONSENT_RELEASE_TEMPLATE = 'Consent to Release/Obtain Information';
const ASSIGNMENT_BENEFITS_TEMPLATE = 'Assignment of Benefits';
const AUTOMATIC_PAYMENT_TEMPLATE = 'Automatic Payment Authorization';
const PHYSICAL_ASSESSMENT_TEMPLATE = 'Physical Assessment';
const VEHICLE_RELEASE_TEMPLATE = 'Vehicle Release & Waiver';
const INFANT_CHILD_ASSESSMENT_TEMPLATE = 'Infant/Child Assessment';
const PERSONAL_ASSISTANTS_TEMPLATE = 'Personal Assistants May Not Do';
const PARTICIPANT_AGREEMENT_TEMPLATE = 'Participant Agreement & Release';
const CLIENT_HANDBOOK_TEMPLATE = 'Client Handbook Acknowledgement';
const CARE_INSTRUCTIONS_TEMPLATE = 'Care Instructions';
const CARE_PLAN_ACK_TEMPLATE = 'Care Plan Acknowledgement';
const EMERGENCY_PLAN_TEMPLATE = 'Emergency Plan';
const HOME_ENVIRONMENT_SAFETY_TEMPLATE = 'Home Environment Safety Checklist';
const CASE_NOTES_TEMPLATE = 'Case Notes';

function isPdfDebugEnabled() {
  const params = new URLSearchParams(window.location.search);
  const raw =
    params.get('pdfDebug') ??
    params.get('debugPdf') ??
    params.get('pdf_grid') ??
    params.get('grid') ??
    '0';

  return ['1', 'true', 'yes', 'on'].includes(String(raw).toLowerCase());
}

const FillForm = () => {
  const { token } = useParams();

  // State
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // PDF template state
  const [templateBytes, setTemplateBytes] = useState(null);
  const [pdfFields, setPdfFields] = useState([]);

  // Form state (3 separate stores by field type)
  const [formValues, setFormValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [signatureValues, setSignatureValues] = useState({});

  // Step 1: Validate token
  useEffect(() => {
    const validateToken = async () => {
      try {
        setLoading(true);
        const response = await onboardingService.getByToken(token);
        if (response.success && response.data) {
          setAssignment(response.data);
        } else {
          setError(response.message || 'Invalid link.');
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'This link is invalid or has expired.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (token) validateToken();
  }, [token]);

  // Step 2: Load template PDF and extract fields
  useEffect(() => {
    const loadTemplate = async () => {
      if (!assignment) return;

      try {
        setLoadingPdf(true);

        // Download the template PDF via secured endpoint
        const pdfArrayBuffer = await onboardingService.getTemplatePdf(token);
        setTemplateBytes(pdfArrayBuffer);

        // Extract form fields from the PDF
        const fields = await extractFormFields(pdfArrayBuffer);
        setPdfFields(fields);
        
        // Debug: Log extracted field names to help identify PDF structure
        console.log('📋 Extracted PDF fields:', fields.map(f => ({ name: f.name, type: f.type })));

        // Pre-fill fields based on template
        const employeeName = assignment.employee_name || '';
        const templateName = assignment?.template?.name || '';
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD for date inputs

        if (templateName === CONSENT_TEMPLATE) {
          // Consent form — pre-fill client name + today's dates
          const preFill = {};
          if (employeeName) preFill['Client Name'] = employeeName;
          preFill['Date'] = today;
          preFill['Date_2'] = today;
          preFill['Date_3'] = today;
          preFill['Date_4'] = today;
          setFormValues((prev) => ({ ...preFill, ...prev }));
        } else if (templateName === CONSENT_RELEASE_TEMPLATE) {
          // Consent to Release form — pre-fill client name + today's date
          const preFill = {};
          if (employeeName) {
            preFill['Client Name'] = employeeName;
            preFill['Print Name of Person Giving Consent'] = employeeName;
          }
          preFill['Date'] = today;
          setFormValues((prev) => ({ ...preFill, ...prev }));
        } else if (employeeName) {
          // Generic forms — pre-fill common client-name fields
          const preFill = {};
          for (const field of fields) {
            const lowerName = field.name.toLowerCase();
            if (
              lowerName === 'client name' ||
              lowerName === 'print first and last name' ||
              lowerName === 'print name' ||
              lowerName === 'name' ||
              lowerName === 'client  responsible party name'
            ) {
              preFill[field.name] = employeeName;
            }
          }
          if (Object.keys(preFill).length > 0) {
            setFormValues((prev) => ({ ...preFill, ...prev }));
          }
        }
      } catch (err) {
        console.error('Failed to load template PDF:', err);
        // Don't set error — the form can still work without the template
        // (it will generate a standalone PDF on submit)
        setSnackbar({
          open: true,
          message: 'Could not load the PDF template. You can still fill the form — a document will be generated on submit.',
          severity: 'warning',
        });
      } finally {
        setLoadingPdf(false);
      }
    };

    loadTemplate();
  }, [assignment, token]);

  // Submit handler
  const handleSubmit = async () => {
    // Basic validation: check if any fields are filled
    const hasFormData = Object.values(formValues).some((v) => v && v.trim());
    const hasCheckboxData = Object.values(checkboxValues).some((v) => v);
    const hasSignatureData = Object.values(signatureValues).some((v) => v);

    if (!hasFormData && !hasCheckboxData && !hasSignatureData) {
      setSnackbar({ open: true, message: 'Please fill in at least some fields before submitting.', severity: 'warning' });
      return;
    }

    try {
      setSubmitting(true);

      // Auto-sync page-2 fields for forms that need it
      const finalFormValues = { ...formValues };
      const templateName = assignment?.template?.name || '';
      if (templateName === CONSENT_TEMPLATE) {
        for (const [target, source] of Object.entries(CONSENT_AUTO_SYNC)) {
          if (finalFormValues[source]) {
            finalFormValues[target] = finalFormValues[source];
          }
        }
      } else if (templateName === CONSENT_RELEASE_TEMPLATE) {
        for (const [target, source] of Object.entries(CONSENT_RELEASE_AUTO_SYNC)) {
          if (finalFormValues[source]) {
            finalFormValues[target] = finalFormValues[source];
          }
        }
      }

      let pdfBlob;
      const debugCoordinates = isPdfDebugEnabled();

      if (templateBytes && pdfFields.length > 0) {
        // Fill the actual template PDF using form field API
        try {
          const filledPdfBytes = await fillPdfForm(
            templateBytes,
            finalFormValues,
            checkboxValues,
            signatureValues
          );
          pdfBlob = new Blob([filledPdfBytes], { type: 'application/pdf' });
        } catch (pdfError) {
          console.warn('PDF filling failed, generating standalone:', pdfError);
          const allData = { ...formValues };
          for (const [k, v] of Object.entries(checkboxValues)) {
            if (v) allData[k] = true;
          }
          const standalonePdfBytes = await generateStandalonePdf(
            allData,
            assignment?.template?.name || 'Document'
          );
          pdfBlob = new Blob([standalonePdfBytes], { type: 'application/pdf' });
        }
      } else {
        // No fillable fields — check for special templates that need overlay
        const templateName = assignment?.template?.name;
        
        if (templateName === CASE_NOTES_TEMPLATE && templateBytes) {
          // Case Notes template is non-fillable; try overlay first, then fallback.
          try {
            const overlayPdfBytes = await fillCaseNotesPdf(
              templateBytes,
              finalFormValues,
              signatureValues,
              { debugCoordinates }
            );
            pdfBlob = new Blob([overlayPdfBytes], { type: 'application/pdf' });
          } catch (overlayError) {
            console.warn('Case Notes overlay failed, generating standalone PDF:', overlayError);
            const allData = { ...formValues };
            for (const [k, v] of Object.entries(checkboxValues)) {
              if (v) allData[k] = true;
            }
            const standalonePdfBytes = await generateStandalonePdf(
              allData,
              templateName || 'Document',
              { debugCoordinates }
            );
            pdfBlob = new Blob([standalonePdfBytes], { type: 'application/pdf' });
          }
        } else {
          // Fallback: generate standalone PDF
          const allData = { ...formValues };
          for (const [k, v] of Object.entries(checkboxValues)) {
            if (v) allData[k] = true;
          }
          const standalonePdfBytes = await generateStandalonePdf(
            allData,
            templateName || 'Document',
            { debugCoordinates }
          );
          pdfBlob = new Blob([standalonePdfBytes], { type: 'application/pdf' });
        }
      }

      // Submit to backend
      console.log('[onboarding] Generated PDF blob:', {
        size: pdfBlob?.size,
        type: pdfBlob?.type,
        isBlob: pdfBlob instanceof Blob,
      });
      const response = await onboardingService.submitForm(token, pdfBlob);

      if (response.success) {
        setSubmitted(true);
        setSnackbar({ open: true, message: 'Form submitted successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: response.message || 'Submission failed.', severity: 'error' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit. Please try again.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render states ───

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f7fa' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={48} />
          <Typography color="text.secondary">Validating your link...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f7fa' }}>
        <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Link Unavailable
          </Typography>
          <Typography color="text.secondary">{error}</Typography>
        </Paper>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f7fa' }}>
        <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Form Submitted!
          </Typography>
          <Typography color="text.secondary">
            Thank you, {assignment?.employee_name}. Your form has been submitted successfully.
            You may close this tab.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fa', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
            FIXLYHANDY
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: '#555' }}>
            {assignment?.template?.name || 'Onboarding Document'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Hello <strong>{assignment?.employee_name}</strong> — please fill in all the sections below and sign where indicated.
          </Typography>
          {assignment?.expires_at && (
            <Alert severity="info" sx={{ mt: 1.5, display: 'inline-flex' }}>
              This form expires on {new Date(assignment.expires_at).toLocaleString()}
            </Alert>
          )}
          {pdfFields.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {pdfFields.length} fields to complete
            </Typography>
          )}
        </Paper>

        {/* Loading PDF template indicator */}
        {loadingPdf && (
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Stack alignItems="center" spacing={1.5}>
              <CircularProgress size={32} />
              <Typography color="text.secondary" variant="body2">
                Loading form template...
              </Typography>
            </Stack>
          </Paper>
        )}

        {/* Form — use custom layout for specific forms, generic for others */}
        {!loadingPdf && assignment?.template?.name === CONSENT_TEMPLATE && (
          <ConsentHomecareLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === CONSENT_RELEASE_TEMPLATE && (
          <ConsentReleaseObtainLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === ASSIGNMENT_BENEFITS_TEMPLATE && (
          <AssignmentBenefitsLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === AUTOMATIC_PAYMENT_TEMPLATE && (
          <AutomaticPaymentLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === PHYSICAL_ASSESSMENT_TEMPLATE && (
          <PhysicalAssessmentLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === VEHICLE_RELEASE_TEMPLATE && (
          <VehicleReleaseWaiverLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === INFANT_CHILD_ASSESSMENT_TEMPLATE && (
          <InfantChildAssessmentLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === PERSONAL_ASSISTANTS_TEMPLATE && (
          <PersonalAssistantsMayNotDoLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === PARTICIPANT_AGREEMENT_TEMPLATE && (
          <ParticipantAgreementReleaseLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === CLIENT_HANDBOOK_TEMPLATE && (
          <ClientHandbookAcknowledgementLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === CARE_INSTRUCTIONS_TEMPLATE && (
          <CareInstructionsLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === CARE_PLAN_ACK_TEMPLATE && (
          <CarePlanAcknowledgementLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === EMERGENCY_PLAN_TEMPLATE && (
          <EmergencyPlanLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === HOME_ENVIRONMENT_SAFETY_TEMPLATE && (
          <HomeEnvironmentSafetyLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && assignment?.template?.name === CASE_NOTES_TEMPLATE && (
          <CaseNotesLayout
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
          />
        )}
        {!loadingPdf && ![
          CONSENT_TEMPLATE,
          CONSENT_RELEASE_TEMPLATE,
          ASSIGNMENT_BENEFITS_TEMPLATE,
          AUTOMATIC_PAYMENT_TEMPLATE,
          PHYSICAL_ASSESSMENT_TEMPLATE,
          VEHICLE_RELEASE_TEMPLATE,
          INFANT_CHILD_ASSESSMENT_TEMPLATE,
          PERSONAL_ASSISTANTS_TEMPLATE,
          PARTICIPANT_AGREEMENT_TEMPLATE,
          CLIENT_HANDBOOK_TEMPLATE,
          CARE_INSTRUCTIONS_TEMPLATE,
          CARE_PLAN_ACK_TEMPLATE,
          EMERGENCY_PLAN_TEMPLATE,
          HOME_ENVIRONMENT_SAFETY_TEMPLATE,
          CASE_NOTES_TEMPLATE
        ].includes(assignment?.template?.name) && (
          <DynamicPdfForm
            fields={pdfFields}
            formValues={formValues}
            checkboxValues={checkboxValues}
            signatureValues={signatureValues}
            onFormChange={setFormValues}
            onCheckboxChange={setCheckboxValues}
            onSignatureChange={setSignatureValues}
            disabled={submitting}
            templateName={assignment?.template?.name || 'Document'}
          />
        )}

        {/* Submit */}
        {!loadingPdf && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                px: 5,
                py: 1.5,
                bgcolor: '#3574BB',
                '&:hover': { bgcolor: '#2a5e9a' },
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </Box>
        )}

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
    </Box>
  );
};

export default FillForm;
