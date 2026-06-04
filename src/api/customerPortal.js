import apiClient from './client';

export const getCustomerQuotes = async () => {
  const response = await apiClient.get('/customer/quotes');
  return response.data?.data?.data || response.data?.data || [];
};

export const getCustomerQuoteById = async (id) => {
  const response = await apiClient.get(`/customer/quotes/${id}`);
  return response.data?.data;
};

export const updateCustomerQuoteApproval = async (id, action, customer_signature = null) => {
  const payload = { action };
  if (customer_signature) payload.customer_signature = customer_signature;
  const response = await apiClient.patch(`/customer/quotes/${id}/approval`, payload);
  return response.data?.data;
};

export const decideQuote = async (id, payload) => {
  const response = await apiClient.post(`/customer/quotes/${id}/decision`, payload);
  return response.data?.data;
};

export const submitQuote = async (id, payload) => {
  const response = await apiClient.post(`/customer/quotes/${id}/submit`, payload);
  return response.data?.data;
};

export const getCustomerServiceRequests = async () => {
  const response = await apiClient.get('/customer/service-requests');
  return response.data?.data?.data || response.data?.data || [];
};

export const getCustomerServiceRequestById = async (id) => {
  const response = await apiClient.get(`/customer/service-requests/${id}`);
  return response.data?.data;
};

export const updateCustomerServiceRequestStatus = async (id, action, customer_signature = null) => {
  const payload = { action };
  if (customer_signature) payload.customer_signature = customer_signature;
  const response = await apiClient.patch(`/customer/service-requests/${id}/status`, payload);
  return response.data?.data;
};

export const getCustomerJobs = async () => {
  const response = await apiClient.get('/customer/jobs');
  return response.data?.data?.data || [];
};

export const getCustomerJobById = async (id) => {
  const response = await apiClient.get(`/customer/jobs/${id}`);
  return response.data?.data;
};

export const getCustomerProfile = async () => {
  const response = await apiClient.get('/customer/me');
  return response.data?.data || response.data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await apiClient.post('/customer/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await apiClient.get('/customer/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await apiClient.post(`/customer/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.post('/customer/notifications/read-all');
  return response.data;
};

export const getCustomerInvoices = async () => {
  const response = await apiClient.get('/customer/invoices');
  return response.data?.data?.data || response.data?.data || [];
};

export const getCustomerInvoiceById = async (id) => {
  const response = await apiClient.get(`/customer/invoices/${id}`);
  return response.data?.data;
};

export const updateCustomerInvoiceStatus = async (id, action, reject_reason = null) => {
  const payload = { action };
  if (reject_reason) payload.reject_reason = reject_reason;
  const response = await apiClient.patch(`/customer/invoices/${id}/status`, payload);
  return response.data?.data;
};

export const getCustomerConversations = async () => {
  const response = await apiClient.get('/customer/messages');
  return response.data;
};

export const sendCustomerMessage = async (vendorId, body) => {
  const response = await apiClient.post('/customer/messages/send', {
    vendor_id: vendorId,
    body,
  });
  return response.data;
};

export const markCustomerAsRead = async (vendorId) => {
  const response = await apiClient.post('/customer/messages/read', {
    vendor_id: vendorId,
  });
  return response.data;
};

export const getCustomerUnreadCount = async () => {
  const response = await apiClient.get('/customer/messages/unread-count');
  return response.data;
};

