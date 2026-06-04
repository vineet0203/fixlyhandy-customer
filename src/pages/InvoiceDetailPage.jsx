import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerInvoiceById, updateCustomerInvoiceStatus } from '../api/customerPortal';
import Loader from '../components/Loader';

const fmtMoney = (v) => v != null ? '$' + Number(v).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}) : '-';
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '-';
const fmtStatus = (s) => String(s||'-').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const norm = (s) => String(s||'').trim().toLowerCase();

const badgeClass = (s) => {
  const v = norm(s);
  if (v === 'accepted') return 'db-badge db-badge-green';
  if (v === 'sent') return 'db-badge db-badge-yellow';
  if (v === 'rejected') return 'db-badge db-badge-red';
  return 'db-badge db-badge-gray';
};

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const payload = await getCustomerInvoiceById(id);
        setInvoice(payload);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch invoice details.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleAccept = async () => {
    if(updatingId) return;
    setUpdatingId(id);
    try {
      await updateCustomerInvoiceStatus(id, 'accepted');
      setInvoice(prev => ({ ...prev, customer_status: 'accepted' }));
    } catch(e) {
      setError(e?.response?.data?.message || 'Action failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const openRejectModal = () => {
    setRejectModalOpen(true);
    setRejectReason('');
    setActionError('');
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setRejectReason('');
    setActionError('');
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) return;
    setSaving(true);
    setActionError('');
    try {
      await updateCustomerInvoiceStatus(id, 'rejected', rejectReason);
      setInvoice(prev => ({ ...prev, customer_status: 'rejected', reject_reason: rejectReason }));
      closeRejectModal();
    } catch(e) {
      setActionError(e?.response?.data?.message || 'Failed to reject invoice.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!invoice) return <div className="db-wrap"><div className="db-card">Invoice not found.</div></div>;

  const status = invoice.customer_status ?? invoice.status;
  const canAct = norm(invoice.customer_status) === 'sent' || norm(invoice.customer_status) === '-' || !invoice.customer_status;

  return (
    <div className="invoice-preview-page">
      <div className="db-topbar" style={{ marginBottom: '24px' }}>
        <div>
          <button type="button" onClick={() => navigate('/invoices')} style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:'#3B6FD4',fontWeight:600,fontSize:'14px',cursor:'pointer',marginBottom:'8px',padding:0}}>
            ← Back to Invoices
          </button>
          <h1 className="db-title">Invoice {invoice.invoice_number}</h1>
          <p className="db-subtitle">View invoice details (Read-Only).</p>
        </div>
        <div>
          <span className={badgeClass(status)} style={{fontSize: '14px', padding: '6px 12px'}}>{fmtStatus(status)}</span>
        </div>
      </div>

      {error && <div style={{ color: '#DC2626', marginBottom: '16px', padding: '0 24px' }}>{error}</div>}

      <div className="invoice-preview-layout" style={{ padding: '0 24px 24px 24px' }}>
        <div className="invoice-left-card">
          <div className="invoice-profile-header">
            <div className="invoice-profile-info">
              {invoice.billing_address ? (
                <div className="invoice-customer-meta">
                  <div className="invoice-customer-name" style={{ fontSize: '24px' }}>{invoice.billing_address.name}</div>
                  <div className="invoice-customer-line" style={{ fontSize: '14px' }}>{invoice.billing_address.address1} {invoice.billing_address.address2}</div>
                  <div className="invoice-customer-line" style={{ fontSize: '14px' }}>{invoice.billing_address.city}, {invoice.billing_address.state} {invoice.billing_address.zip}</div>
                  <div className="invoice-customer-line" style={{ fontSize: '14px' }}>{invoice.billing_address.country}</div>
                </div>
              ) : null}
            </div>

            <div className="invoice-header-right">
              <div className="invoice-number-badge">
                {invoice.invoice_number}
              </div>
              <div className="invoice-total-label">Total Amount</div>
              <div className="invoice-total-value">{fmtMoney(invoice.totals?.total_amount)}</div>
            </div>
          </div>

          <div className="invoice-billing-card">
            <div className="invoice-billing-grid">
              <div className="invoice-date-card">
                <div className="invoice-section-label">Bill Date</div>
                <div className="invoice-date-value">{fmtDate(invoice.bill_date)}</div>

                <div className="invoice-section-label">Delivery Date</div>
                <div className="invoice-date-value">{fmtDate(invoice.delivery_date)}</div>

                <div className="invoice-section-label">Payment Deadline</div>
                <div className="invoice-date-value">{fmtDate(invoice.payment_deadline)}</div>

                <div className="invoice-section-label">Employee</div>
                <div className="invoice-date-value invoice-date-mileage">{invoice.employee?.name || '-'}</div>
              </div>

              <div className="invoice-address-wrap">
                <div className="invoice-section-label invoice-address-label">Billing Address</div>
                <div className="invoice-address-name">{invoice.billing_address?.name || '-'}</div>
                <div className="invoice-address-line">{invoice.billing_address?.address1} {invoice.billing_address?.address2}</div>
                <div className="invoice-address-line invoice-address-contact">{invoice.billing_address?.contact}</div>
                <div className="invoice-section-label invoice-note-label" style={{ marginTop: '16px' }}>Note</div>
                <div className="invoice-note-text">{invoice.note || '-'}</div>
              </div>
            </div>
          </div>

          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Job Name</th>
                  <th>Mileage</th>
                  <th>Other Expense</th>
                  <th>Amount</th>
                  <th>VAT (%)</th>
                  <th>Final Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.length > 0 ? invoice.items.map((item, i) => (
                  <tr key={item.id || i}>
                    <td>{i + 1}</td>
                    <td>{item.job_name}</td>
                    <td>{fmtMoney(item.mileage)}</td>
                    <td>{fmtMoney(item.other_expense)}</td>
                    <td>{fmtMoney(item.amount)}</td>
                    <td>{item.vat}%</td>
                    <td style={{fontWeight: 600}}>{fmtMoney(item.final_amount)}</td>
                  </tr>
                )) : <tr><td colSpan="6" className="db-empty" style={{textAlign: 'center', padding: '20px'}}>No items.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="invoice-terms-wrap">
            <div className="invoice-section-label">Terms &amp; Conditions</div>
            <div className="invoice-terms-text">{invoice.terms_conditions || 'No notes or terms provided.'}</div>
          </div>
        </div>

        <div className="invoice-right-panel">
          <div className="invoice-summary-card">
            <div className="invoice-summary-title">Summary</div>

            <div className="invoice-summary-row">
              <div className="invoice-summary-key">Weekly Amount</div>
              <div className="invoice-summary-value">{fmtMoney(invoice.totals?.weekly_amount)} Incl. VAT</div>
            </div>

            <div className="invoice-summary-row">
              <div className="invoice-summary-key">Mileage</div>
              <div className="invoice-summary-value">{fmtMoney(invoice.totals?.mileage)}</div>
            </div>

            <div className="invoice-summary-row">
              <div className="invoice-summary-key">Other Expense</div>
              <div className="invoice-summary-value">{fmtMoney(invoice.totals?.other_expense)}</div>
            </div>

            <div className="invoice-summary-row">
              <div className="invoice-summary-key">VAT</div>
              <div className="invoice-summary-value">{fmtMoney(invoice.totals?.vat)}</div>
            </div>

            <div className="invoice-summary-total-row">
              <div className="invoice-summary-key invoice-summary-total-key">Total</div>
              <div className="invoice-summary-total-badge" style={{ background: '#d1fae5', color: '#065f46' }}>{fmtMoney(invoice.totals?.total_amount)} Incl. VAT</div>
            </div>
          </div>

          {canAct && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                style={{ flex: 1, background: '#DC2626', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} 
                disabled={!!updatingId} 
                onClick={openRejectModal}
              >
                Reject Invoice
              </button>
              <button 
                style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} 
                disabled={!!updatingId}
                onClick={handleAccept}
              >
                Accept Invoice
              </button>
            </div>
          )}
        </div>
      </div>

      {rejectModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(480px, 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>Reject Invoice</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6B7280' }}>{invoice.invoice_number}</p>
            
            <textarea 
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', marginBottom: '8px', fontSize: '14px', resize: 'vertical' }}
            />

            {actionError && <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px' }}>{actionError}</p>}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeRejectModal} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button 
                type="button" 
                onClick={submitReject} 
                disabled={!rejectReason.trim() || saving} 
                style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: '#DC2626', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: (!rejectReason.trim() || saving) ? 0.6 : 1 }}
              >
                {saving ? 'Saving...' : 'Reject Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;
