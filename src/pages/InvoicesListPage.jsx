import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerInvoices, updateCustomerInvoiceStatus } from '../api/customerPortal';

const I_PER_PAGE = 10;

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

const canAct = (status) => {
  const v = norm(status);
  return v === 'sent' || v === '-' || v === 'draft' || v === '';
};

const InvoicesListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [iPage, setIPage]       = useState(1);
  const [error, setError]       = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  
  // Reject Modal State
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const payload = await getCustomerInvoices();
        setInvoices(Array.isArray(payload) ? payload : []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch invoices.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAccept = async (id) => {
    if(updatingId) return;
    setUpdatingId(id);
    try {
      await updateCustomerInvoiceStatus(id, 'accepted');
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, customer_status: 'accepted' } : inv));
    } catch(e) {
      setError(e?.response?.data?.message || 'Action failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const openRejectModal = (invoice) => {
    setRejectModal(invoice);
    setRejectReason('');
    setActionError('');
  };

  const closeRejectModal = () => {
    setRejectModal(null);
    setRejectReason('');
    setActionError('');
  };

  const submitReject = async () => {
    if (!rejectReason.trim() || !rejectModal) return;
    setSaving(true);
    setActionError('');
    try {
      await updateCustomerInvoiceStatus(rejectModal.id, 'rejected', rejectReason);
      setInvoices(prev => prev.map(inv => inv.id === rejectModal.id ? { ...inv, customer_status: 'rejected', reject_reason: rejectReason } : inv));
      closeRejectModal();
    } catch(e) {
      setActionError(e?.response?.data?.message || 'Failed to reject invoice.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  const paged = invoices.slice((iPage - 1) * I_PER_PAGE, iPage * I_PER_PAGE);

  return (
    <div className="db-wrap">
      <div className="db-topbar">
        <div>
          <h1 className="db-title">Invoices</h1>
          <p className="db-subtitle">Manage and view your invoices</p>
        </div>
      </div>

      {error && <div style={{ color: '#DC2626', marginBottom: '16px', padding: '0 24px' }}>{error}</div>}

      <div className="db-card" style={{ minHeight: 'calc(100vh - 190px)', display: 'flex', flexDirection: 'column' }}>
        <div className="db-quotes-table-wrap" style={{ flex: 1 }}>
          <table className="db-table" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '130px' }}>INVOICE #</th>
                <th style={{ width: '130px' }}>BILL DATE</th>
                <th style={{ width: '150px' }}>PAYMENT DEADLINE</th>
                <th>ITEMS</th>
                <th style={{ width: '130px' }}>TOTAL AMOUNT</th>
                <th style={{ width: '120px' }}>STATUS</th>
                <th style={{ width: '250px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={7} className="db-empty">No invoices found.</td></tr>
              )}
              {paged.map((inv) => {
                const status = inv.customer_status ?? inv.status;
                const totalAmount = inv.totals?.total_amount || 0;
                
                return (
                  <tr key={inv.id}>
                    <td><span className="db-qid">{inv.invoice_number}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(inv.bill_date)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(inv.payment_deadline)}</td>
                    <td>{inv.items?.length || 0} items</td>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{fmtMoney(totalAmount)}</td>
                    <td><span className={badgeClass(status)}>{fmtStatus(status)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Link className="db-btn" to={`/invoices/${inv.id}`}>View</Link>
                        {canAct(inv.customer_status) && (
                          <>
                            <button 
                              className="db-btn" 
                              style={{ background: '#059669', color: '#fff', border: 'none' }} 
                              disabled={!!updatingId}
                              onClick={() => handleAccept(inv.id)}
                            >
                              Accept
                            </button>
                            <button 
                              className="db-btn" 
                              style={{ background: '#DC2626', color: '#fff', border: 'none' }} 
                              disabled={!!updatingId} 
                              onClick={() => openRejectModal(inv)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '20px', padding: '0 24px 24px 24px' }}>
          <Pagination page={iPage} total={invoices.length} perPage={I_PER_PAGE} onPage={setIPage} />
        </div>

        {rejectModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(480px, 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>Reject Invoice</h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6B7280' }}>{rejectModal.invoice_number}</p>
              
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
    </div>
  );
};

export default InvoicesListPage;
