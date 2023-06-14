import apiInstance from "utils/api";

export default {
  async invoices(organisationId, payload) {
    return await apiInstance.get(`/api/v1/invoices/${organisationId}/invoice/`, { params: payload });
  },
  async invoiceById(payload) {
    return await apiInstance.get(`/api/v1/invoices/${payload?.organisation_id}/invoice/${payload?.invoice_id}/`, {
      params: { provider_id: payload?.providerId, project_id: payload?.projectId },
    });
  },
  async downloadInvoice(payload) {
    return await apiInstance.get(`/api/v1/invoices/${payload?.organisation_id}/invoice/${payload?.invoice_id}/download_invoice/`, { responseType: "blob" });
  },
  async isInvoiceEnabled(payload) {
    return await apiInstance.get(`/api/v1/invoices/${payload?.organisation_id}/check-invoice-enabled/`);
  },
};
