import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { getCustomerQuoteById, getCustomerJobById, updateCustomerQuoteApproval, uploadProfilePhoto, getCustomerProfile, getCustomerQuotes, getCustomerJobs } from '../api/customerPortal';
import Modal from '../components/Modal';
import './DashboardPage.css';

const DashboardPage = () => {
  const [customer, setCustomer] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropObj, setCropObj] = useState({ x:0, y:0, size:150 });
  const cropCanvasRef = useRef(null);
  const [quotes, setQuotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dataError, setDataError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quotePage, setQuotePage] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const PER_PAGE = 5;
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let isFirst = true;
    const load = async () => {
      if (isFirst) setLoading(true);
      try {
        const [profile, customerQuotes, customerJobs] = await Promise.all([
          getCustomerProfile(), getCustomerQuotes(), getCustomerJobs(),
        ]);
        if (isMounted) {
          const saved = JSON.parse(localStorage.getItem('customer_profile') || '{}');
          setCustomer({ ...(profile || {}), profile_photo: profile?.profile_photo || saved?.profile_photo || null });
          setQuotes(Array.isArray(customerQuotes) ? customerQuotes : []);
          setJobs(Array.isArray(customerJobs) ? customerJobs : []);
        }
      } catch { if (isMounted) setDataError('Unable to load data.'); } finally { if (isMounted) { setLoading(false); isFirst = false; } }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);


  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const data = await uploadProfilePhoto(file);
      setCustomer(prev => {
        const updated = { ...prev, profile_photo: data.profile_photo };
        localStorage.setItem('customer_profile', JSON.stringify(updated));
        setTimeout(() => window.dispatchEvent(new StorageEvent('storage', { key: 'customer_profile' })), 0);
        return updated;
      });
    } catch (err) {
      console.error('Photo upload failed', err);
    } finally {
      setPhotoUploading(false);
    }
  };

  const stats = useMemo(() => {
    const totalQuotes = quotes.length;
    const approvedQuotes = quotes.filter((q) => norm(q.status) === 'approved').length;
    const activeJobs = jobs.filter((j) => norm(j.status) !== 'completed').length;
    const pendingPayments = jobs.filter((j) => norm(j.status) === 'pending payment').length;
    return [
      { label: 'Total Quotes', value: totalQuotes, color: 'blue', icon: <QuoteIcon /> },
      { label: 'Approved Quotes', value: approvedQuotes, color: 'orange', icon: <CheckIcon /> },
      { label: 'Active Jobs', value: activeJobs, color: 'green', icon: <JobIcon /> },
      { label: 'Pending Payments', value: pendingPayments, color: 'purple', icon: <PayIcon /> },
    ];
  }, [quotes, jobs]);

  const openQuote = async (id) => {
    setDetailLoading(true);
    try { const q = await getCustomerQuoteById(id); setSelectedQuote(q); } catch {}
    setDetailLoading(false);
  };

  const openJob = async (id) => {
    setDetailLoading(true);
    try { const j = await getCustomerJobById(id); setSelectedJob(j); } catch {}
    setDetailLoading(false);
  };

  const handleApproval = async (quoteId, action) => {
    try {
      const updated = await updateCustomerQuoteApproval(quoteId, action);
      setSelectedQuote(prev => ({ ...prev, ...updated }));
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, ...updated } : q));
    } catch (e) { setActionError('Action failed.'); }
  };

  const initials = customer?.name ? customer.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'C';

  if (loading) return <Loader fullPage />;

  return (
    <div className="db-wrap">
      <div className="db-topbar">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-subtitle">Welcome back, {customer?.name || 'Customer'}!</p>
        </div>
        <div className="db-profile-pill" onClick={() => setIsProfileOpen(true)}>
          <div className="db-avatar">{initials}</div>
          <div>
            <p className="db-pname">{customer?.name || 'Customer'}</p>
            <p className="db-prole">Customer</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6B7280"><path d="M7 10l5 5 5-5z"/></svg>
        </div>
      </div>

      <section className="db-stats">
        {stats.map((s) => (
          <div key={s.label} className={`db-stat db-stat-${s.color}`}>
            <div className="db-stat-icon">{s.icon}</div>
            <div className="db-stat-val">{s.value}</div>
            <div className="db-stat-lbl">{s.label}</div>
          </div>
        ))}
      </section>

      <div className="db-card">
        <h3 className="db-card-title">Quotes for Approval</h3>
        <div className="db-quotes-table-wrap"><table className="db-table">
          <thead><tr><th>Quote ID</th><th>Title</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {quotes.length === 0 && <tr><td colSpan="6" className="db-empty">{dataError || 'No quotes yet.'}</td></tr>}
            {quotes.slice((quotePage-1)*PER_PAGE, quotePage*PER_PAGE).map((q) => (
              <tr key={q.id || q.uuid}>
                <td className="db-qid">{q.quote_number || `QT-${String(q.id).padStart(5,'0')}`}</td>
                <td>{q.title || q.subject || '-'}</td>
                <td>{fmtMoney(q.total_amount || q.total || q.amount)}</td>
                <td>{fmtDate(q.created_at || q.date)}</td>
                <td><span className={`db-badge ${qBadge(q.status)}`}>{fmtStatus(q.status)}</span></td>
                <td><button className="db-btn" onClick={() => openQuote(q.id)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
          <Pagination page={quotePage} total={quotes.length} perPage={PER_PAGE} onPage={setQuotePage} />
      </div>

      <div className="db-card">
        <h3 className="db-card-title">My Jobs</h3>
        <div className="db-jobs-table-wrap"><table className="db-table">
          <thead><tr><th>Job Title</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {jobs.length === 0 && <tr><td colSpan="3" className="db-empty">{dataError || 'No jobs yet.'}</td></tr>}
            {jobs.slice((jobPage-1)*PER_PAGE, jobPage*PER_PAGE).map((j) => (
              <tr key={j.id || j.uuid}>
                <td className="db-jtitle">{j.title || j.name || j.job_title || 'Job'}</td>
                <td>{fmtDate(j.date || j.start_date || j.scheduled_at)}</td>
                <td><span className={`db-badge ${jBadge(j.status)}`}>{fmtStatus(j.status)}</span></td>
                <td><button className="db-btn" onClick={() => openJob(j.id)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
          <Pagination page={jobPage} total={jobs.length} perPage={PER_PAGE} onPage={setJobPage} />
      </div>

      {/* Quote Detail Modal */}
      <Modal isOpen={!!selectedQuote} title={`Quote: ${selectedQuote?.quote_number || ''}`} onClose={() => { setSelectedQuote(null); setActionError(''); }}>
        {detailLoading ? <Loader /> : selectedQuote && (
          <div className="db-detail">
            <div className="db-detail-grid">
              {[['Quote #', selectedQuote.quote_number], ['Title', selectedQuote.title], ['Status', selectedQuote.status], ['Due Date', selectedQuote.quote_due_date || '-'], ['Subtotal', `${selectedQuote.currency || '$'} ${Number(selectedQuote.subtotal||0).toFixed(2)}`], ['Total', `${selectedQuote.currency || '$'} ${Number(selectedQuote.total_amount||0).toFixed(2)}`]].map(([l,v]) => (
                <div key={l}><p className="db-mlabel">{l}</p><p className="db-mval">{v || '-'}</p></div>
              ))}
            </div>
            {selectedQuote.items?.length > 0 && (
              <div style={{marginTop:'16px'}}>
                <p className="db-mlabel" style={{marginBottom:'8px'}}>LINE ITEMS</p>
                <table className="db-table" style={{fontSize:'13px'}}>
                  <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                  <tbody>{selectedQuote.items.map((item,i) => (
                    <tr key={i}>
                      <td>{item.item_name}</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.unit_price).toFixed(2)}</td>
                      <td>{Number(item.quantity * item.unit_price * (1 + item.tax_rate/100)).toFixed(2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {selectedQuote.notes && <div style={{marginTop:'12px'}}><p className="db-mlabel">NOTES</p><p className="db-mval">{selectedQuote.notes}</p></div>}
            {actionError && <p style={{color:'red',fontSize:'13px'}}>{actionError}</p>}
            {['pending','draft'].includes(String(selectedQuote.status||'').toLowerCase()) && (
              <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>

              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Job Detail Modal */}
      <Modal isOpen={!!selectedJob} title={`Job: ${selectedJob?.job_number || selectedJob?.title || ''}`} onClose={() => setSelectedJob(null)}>
        {detailLoading ? <Loader /> : selectedJob && (
          <div className="db-detail">
            <div className="db-detail-grid">
              {[['Job #', selectedJob.job_number], ['Title', selectedJob.title], ['Status', selectedJob.status], ['Date', selectedJob.start_date || selectedJob.scheduled_at || '-'], ['Rate', selectedJob.job_rate?.formatted || '-'], ['Total', selectedJob.total_amount ? `${selectedJob.currency||'$'} ${Number(selectedJob.total_amount).toFixed(2)}` : '-']].map(([l,v]) => (
                <div key={l}><p className="db-mlabel">{l}</p><p className="db-mval">{v || '-'}</p></div>
              ))}
            </div>
            {selectedJob.notes && <div style={{marginTop:'12px'}}><p className="db-mlabel">NOTES</p><p className="db-mval">{selectedJob.notes}</p></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={isProfileOpen} title="Customer Profile" onClose={() => setIsProfileOpen(false)}>
        <div className="db-modal-body">
          <div className="db-modal-avatar-wrap">
            {customer?.profile_photo
              ? <img src={customer.profile_photo} alt="Profile" className="db-modal-avatar-img" />
              : <div className="db-modal-avatar">{initials}</div>
            }
            <label className="db-photo-upload-btn" title={photoUploading ? 'Uploading...' : 'Change photo'}>
              {photoUploading ? '⏳' : '📷'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            </label>
          </div>
          <h2 className="db-modal-name">{customer?.name || '-'}</h2>
          <p className="db-modal-email">{customer?.email || '-'}</p>
          <div className="db-modal-grid">
            {[
              ['Phone', customer?.phone],
              ['Status', customer?.status],
              ['Client Type', customer?.client_type],
              ['Business Name', customer?.business_name],
              ['Business Type', customer?.business_type],
              ['Industry', customer?.industry],
              ['Contact Person', customer?.contact_person_name],
              ['Designation', customer?.designation],
              ['Billing Name', customer?.billing_name],
              ['Payment Term', customer?.payment_term],
              ['Preferred Currency', customer?.preferred_currency],
              ['Tax Applicable', customer?.is_tax_applicable ? 'Yes' : 'No'],
              ['Tax Percentage', customer?.tax_percentage ? `${customer.tax_percentage}%` : null],
              ['Website', customer?.website_url],
              ['Service Category', customer?.service_category],
              ['Address Line 1', customer?.address_line_1],
              ['Address Line 2', customer?.address_line_2],
              ['City', customer?.city],
              ['State', customer?.state],
              ['Country', customer?.country],
              ['Zip Code', customer?.zip_code],
              ['Alternate Phone', customer?.alternate_mobile_number],
              ['Notes', customer?.notes],
            ].filter(([,val]) => val).map(([label, val]) => (
              <div key={label}>
                <p className="db-mlabel">{label}</p>
                <p className="db-mval">{val || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {cropSrc && (
        <div className="crop-modal-overlay">
          <div className="crop-modal-box">
            <h3>Adjust Photo</h3>
            <div className="crop-preview-wrap">
              <img src={cropSrc} alt="preview" className="crop-source-img" />
              <canvas ref={cropCanvasRef} className="crop-canvas" />
            </div>
            <div className="crop-controls">
              <label>Zoom / Position X
                <input type="range" min="0" max="300" value={cropObj.x}
                  onChange={e => setCropObj(p => ({...p, x: Number(e.target.value)}))} />
              </label>
              <label>Position Y
                <input type="range" min="0" max="300" value={cropObj.y}
                  onChange={e => setCropObj(p => ({...p, y: Number(e.target.value)}))} />
              </label>
              <label>Size
                <input type="range" min="50" max="600" value={cropObj.size}
                  onChange={e => setCropObj(p => ({...p, size: Number(e.target.value)}))} />
              </label>
            </div>
            <div className="crop-actions">
              <button className="crop-cancel-btn" onClick={() => setCropSrc(null)}>Cancel</button>
              <button className="crop-save-btn" onClick={handleCropSave} disabled={photoUploading}>
                {photoUploading ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

const norm = (s) => String(s || '').trim().toLowerCase();
const fmtStatus = (s) => String(s || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '-';
const fmtMoney = (v) => { if (v == null || v === '') return '-'; const n = parseFloat(v); return isNaN(n) ? String(v) : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n); };
const fmtDate = (v) => { if (!v) return '-'; const d = new Date(v); return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); };
const qBadge = (s) => { const v = norm(s); if (v==='approved') return 'db-green'; if (v==='rejected') return 'db-red'; if (v==='draft') return 'db-gray'; return 'db-orange'; };
const jBadge = (s) => { const v = norm(s); if (v==='completed') return 'db-green'; if (v==='pending') return 'db-orange'; return 'db-blue'; };
const QuoteIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
const CheckIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>;
const JobIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 00-5.5-1.65l-.5.67-.5-.68A3 3 0 006 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>;
const PayIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;