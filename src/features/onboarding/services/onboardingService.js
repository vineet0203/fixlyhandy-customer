// features/onboarding/services/onboardingService.js
import apiClient from '../../../api/client';
const BASE = '/onboarding';
const onboardingService = {
  /** Validate token and get assignment details */
  async getByToken(token) {
    const response = await apiClient.get(`${BASE}/${token}`);
    return response.data;
  },
  /** Download the blank template PDF for filling (public, token-based) */
  async getTemplatePdf(token) {
    const response = await apiClient.get(`${BASE}/${token}/template-pdf`, {
      responseType: 'arraybuffer',
      params: { v: Date.now() },
    });
    return response.data;
  },
  /** Submit completed PDF */
  async submitForm(token, pdfBlob) {
    const formData = new FormData();
    formData.append('completed_pdf', pdfBlob, 'completed-form.pdf');
    const response = await apiClient.post(`${BASE}/${token}/submit`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
};
export default onboardingService;
