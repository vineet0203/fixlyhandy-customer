import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerServiceRequests, updateCustomerServiceRequestStatus } from '../api/customerPortal';

const PER_PAGE = 10;

const fmtMoney = (v) => v != null ? '$' + Number(v).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}) : '-';
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '-';
const fmtStatus= (s) => String(s||'').replace(/_/g,' ').replace(/\b\w/g,(c)=>c.toUpperCase()) || '-';
const norm = (s) => String(s||'').trim().toLowerCase();

const badgeClass = (s) => {
  const v = norm(s);
  if (v === 'approved' || v === 'accepted') return 'db-badge db-badge-green';
  if (v === 'pending') return 'db-badge db-badge-yellow';
  if (v === 'rejected') return 'db-badge db-badge-red';
  return 'db-badge db-badge-gray';
};

const canAct = (q) => !['accepted','rejected','approved'].includes(norm(q?.approval_status||q?.status));

const ServiceRequestsPage = () => {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]       = useState(1);
  const [error, setError]       = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [sigModal, setSigModal] = useState(null);
  const [sigMode, setSigMode]   = useState('draw');
  const [drawing, setDrawing]   = useState(false);
  const [hasSig, setHasSig]     = useState(false);
  const [saving, setSaving]     = useState(false);
  const [actionError, setActionError] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const payload = await getCustomerServiceRequests();
        setRequests(Array.isArray(payload) ? payload : []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch service requests.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openSigModal = (req) => {
    setSigModal(req); setHasSig(false); setActionError(''); setSigMode('draw');
    setTimeout(() => canvasRef.current?.getContext('2d').clearRect(0,0,400,150), 50);
  };

  const closeSigModal = () => { setSigModal(null); setHasSig(false); setActionError(''); };

  const getPoint = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const t = e.touches?.[0];
    return { x:(t?t.clientX:e.clientX)-r.left, y:(t?t.clientY:e.clientY)-r.top };
  };
  const startDraw = (e) => { setDrawing(true); const ctx=canvasRef.current.getContext('2d'); const p=getPoint(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const doDraw   = (e) => { if(!drawing)return; e.preventDefault(); const ctx=canvasRef.current.getContext('2d'); ctx.lineWidth=2;ctx.lineCap='round';ctx.strokeStyle='#000'; const p=getPoint(e); ctx.lineTo(p.x,p.y);ctx.stroke(); setHasSig(true); };
  const endDraw  = () => setDrawing(false);
  const clearCanvas = () => { canvasRef.current.getContext('2d').clearRect(0,0,400,150); setHasSig(false); };
  const handleUpload = (e) => {
    const file = e.target.files?.[0]; if(!file)return;
    const reader = new FileReader();
    reader.onload = (ev) => { const img=new Image(); img.onload=()=>{ const c=canvasRef.current; c.getContext('2d').clearRect(0,0,c.width,c.height); c.getContext('2d').drawImage(img,0,0,c.width,c.height); setHasSig(true); }; img.src=ev.target.result; };
    reader.readAsDataURL(file);
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try { 
      await updateCustomerServiceRequestStatus(id, 'rejected'); 
      setRequests(prev => prev.map(q => q.id === id ? { ...q, status: 'rejected', approval_status: 'rejected' } : q)); 
    }
    catch (e) { alert("Failed to reject request"); }
  };

  const submitAccept = async () => {
    if (!hasSig || !sigModal) return;
    setSaving(true);
    setActionError('');
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      await updateCustomerServiceRequestStatus(sigModal.id, 'accepted', dataUrl);
      setRequests(prev => prev.map(q => q.id === sigModal.id ? { ...q, status: 'approved', approval_status: 'accepted', customer_signature: dataUrl } : q));
      closeSigModal();
    } catch(e) { 
      setActionError(e?.response?.data?.message || 'Failed to save.'); 
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="db-wrap">
      <div className="db-topbar" style={{marginBottom:'24px'}}>
        <div>
          <h1 className="db-title">Service Requests</h1>
          <p className="db-subtitle">Manage and respond to booking requests from the marketplace</p>
        </div>
      </div>

      <div className="db-card" style={{ minHeight: 'calc(100vh - 190px)', display: 'flex', flexDirection: 'column' }}>
        <div className="db-quotes-table-wrap" style={{flex: 1}}>
          <table className="db-table" style={{tableLayout:'fixed',width:'100%'}}>
            <thead>
              <tr>
                <th style={{width:'130px'}}>REQUEST ID</th>
                <th>CUSTOMER</th>
                <th>TITLE</th>
                <th style={{width:'130px'}}>DATE ISSUED</th>
                <th style={{width:'130px'}}>DUE DATE</th>
                <th style={{width:'120px'}}>STATUS</th>
                <th style={{width:'130px'}}>AMOUNT</th>
                <th style={{width:'250px'}}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr><td colSpan={8} className="db-empty">{error || 'No service requests found.'}</td></tr>
              )}
              {requests.slice((page-1)*PER_PAGE, page*PER_PAGE).map((q) => (
                <tr key={q.id}>
                  <td><span className="db-qid">{q.quote_number || q.id}</span></td>
                  <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{q.client_name || '-'}</td>
                  <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{q.title || '-'}</td>
                  <td style={{whiteSpace:'nowrap'}}>{fmtDate(q.created_at)}</td>
                  <td style={{whiteSpace:'nowrap'}}>{fmtDate(q.quote_due_date || q.expires_at)}</td>
                  <td><span className={badgeClass(q.status)}>{fmtStatus(q.status)}</span></td>
                  <td style={{whiteSpace:'nowrap', fontWeight: 500}}>{parseFloat(q.total_amount) === 0 ? 'Pending Quotation' : fmtMoney(q.total_amount)}</td>
                  <td>
                    <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                      <Link className="db-btn" to={`/service-requests/${q.id}`}>View</Link>
                      {canAct(q) && (
                        <>
                          <button className="db-btn" style={{background:'#059669',color:'#fff',border:'none'}} onClick={()=>openSigModal(q)}>Accept</button>
                          <button className="db-btn" style={{background:'#DC2626',color:'#fff',border:'none'}} onClick={()=>handleReject(q.id)}>Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop: '20px', padding: '0 24px 24px 24px'}}>
          <Pagination page={page} total={requests.length} perPage={PER_PAGE} onPage={setPage} />
        </div>
      </div>

      {sigModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'24px'}}>
          <div style={{background:'#fff',borderRadius:'12px',padding:'24px',width:'min(480px,100%)',boxShadow:'0 20px 40px rgba(0,0,0,0.2)'}}>
            <h3 style={{margin:'0 0 4px',fontSize:'18px',fontWeight:700}}>Sign & Accept Service Request</h3>
            <p style={{margin:'0 0 16px',fontSize:'13px',color:'#6B7280'}}>{sigModal.quote_number || sigModal.id} — {sigModal.title}</p>
            <div style={{display:'flex',gap:'10px',marginBottom:'12px'}}>
              <button type="button" onClick={()=>{setSigMode('draw');clearCanvas();}} style={{padding:'6px 16px',borderRadius:'6px',border:'1px solid #D1D5DB',background:sigMode==='draw'?'#183B59':'#fff',color:sigMode==='draw'?'#fff':'#374151',cursor:'pointer',fontWeight:600}}>Draw</button>
              <button type="button" onClick={()=>{setSigMode('upload');clearCanvas();}} style={{padding:'6px 16px',borderRadius:'6px',border:'1px solid #D1D5DB',background:sigMode==='upload'?'#183B59':'#fff',color:sigMode==='upload'?'#fff':'#374151',cursor:'pointer',fontWeight:600}}>Upload</button>
            </div>
            <canvas ref={canvasRef} width={400} height={150}
              style={{border:'1px dashed #999',borderRadius:'4px',background:'#fafafa',cursor:sigMode==='draw'?'crosshair':'default',touchAction:'none',width:'100%'}}
              onMouseDown={sigMode==='draw'?startDraw:undefined} onMouseMove={sigMode==='draw'?doDraw:undefined}
              onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={sigMode==='draw'?startDraw:undefined} onTouchMove={sigMode==='draw'?doDraw:undefined} onTouchEnd={endDraw} />
            {sigMode==='upload' && <input type="file" accept="image/*" onChange={handleUpload} style={{marginTop:'8px',display:'block'}} />}
            {actionError && <p style={{color:'#DC2626',fontSize:'13px',marginTop:'8px'}}>{actionError}</p>}
            <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
              <button type="button" onClick={clearCanvas} style={{padding:'8px 16px',borderRadius:'6px',border:'1px solid #D1D5DB',background:'#fff',cursor:'pointer'}}>Clear</button>
              <button type="button" onClick={closeSigModal} style={{padding:'8px 16px',borderRadius:'6px',border:'1px solid #D1D5DB',background:'#fff',cursor:'pointer'}}>Cancel</button>
              <button type="button" onClick={submitAccept} disabled={!hasSig||saving} style={{padding:'8px 20px',borderRadius:'6px',border:'none',background:'#059669',color:'#fff',fontWeight:600,cursor:'pointer',opacity:(!hasSig||saving)?0.6:1}}>
                {saving?'Saving...':'Accept & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestsPage;
