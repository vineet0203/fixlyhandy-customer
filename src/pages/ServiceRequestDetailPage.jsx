import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCustomerServiceRequestById, updateCustomerServiceRequestStatus } from '../api/customerPortal';

const ServiceRequestDetailPage = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const q = await getCustomerServiceRequestById(id);
        setQuote(q);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch service request details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    };
  };

  const startDraw = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const p = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const doDraw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    const p = getPoint(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasSig(true);
  };

  const endDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSig(true);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReject = async () => {
    if(!window.confirm("Are you sure you want to reject this request?")) return;
    setActionError('');
    try {
      const updated = await updateCustomerServiceRequestStatus(id, 'rejected');
      setQuote(prev => ({ ...prev, status: updated.status, approval_status: updated.approval_status }));
    } catch(e) { setActionError('Failed to reject request.'); }
  };

  const submitSignature = async () => {
    if(!hasSig) return;
    setSaving(true); setActionError('');
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const updated = await updateCustomerServiceRequestStatus(id, 'accepted', dataUrl);
      setQuote(prev => ({ ...prev, status: updated.status, approval_status: updated.approval_status, customer_signature: dataUrl }));
    } catch(e) { setActionError(e?.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="customer-page-card"><p>Loading...</p></div>;
  if (!quote) return <div className="customer-page-card"><p>Service request not found.</p></div>;

  return (
    <div className="customer-page-card">
      <Link to="/service-requests" style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:'#3B6FD4',fontWeight:600,fontSize:'14px',cursor:'pointer',marginBottom:'16px',padding:0,textDecoration:'none'}}>
        ← Back to Service Requests
      </Link>

      <h1 className="customer-page-title">Service Request Detail</h1>
      <p className="customer-page-subtitle">View service request details.</p>

      {error && <div className="customer-login-alert">{error}</div>}
      {actionError && <div className="customer-login-alert">{actionError}</div>}

      <div className="customer-detail-grid" style={{marginBottom:'20px'}}>
        <div><label className="customer-login-label">Request Number</label><input className="customer-login-input" value={quote.request_number||''} disabled /></div>
        <div><label className="customer-login-label">Title</label><input className="customer-login-input" value={quote.title||''} disabled /></div>
        <div><label className="customer-login-label">Status</label><input className="customer-login-input" value={quote.status||''} disabled /></div>
      </div>

      <div style={{marginTop:'30px'}}>
        <h3 className="customer-page-title" style={{fontSize:'18px'}}>Signature Approval</h3>
        {!['accepted','rejected'].includes(String(quote.approval_status||'').toLowerCase()) ? (
          <div>
            <canvas ref={canvasRef} width={400} height={200} style={{border:'1px solid #ccc',touchAction:'none',display:'block',marginBottom:'10px'}} 
              onMouseDown={startDraw} onMouseMove={doDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={doDraw} onTouchEnd={endDraw} />
            <div style={{display:'flex',gap:'10px',marginBottom:'10px'}}>
              <button onClick={clearCanvas} className="db-btn">Clear</button>
              <input type="file" accept="image/*" onChange={handleUpload} style={{paddingTop: '6px'}}/>
            </div>
            <button disabled={!hasSig||saving} onClick={submitSignature} className="db-btn" style={{background:'#059669',color:'#fff',border:'none'}}>Accept Request</button>
            <button onClick={handleReject} className="db-btn" style={{background:'#DC2626',color:'#fff',border:'none',marginLeft:'10px'}}>Reject Request</button>
          </div>
        ) : (
          <div style={{marginBottom:'20px'}}>
             <p style={{fontWeight: 600, color: quote.approval_status === 'accepted' ? '#059669' : '#DC2626'}}>
                Status: {String(quote.approval_status || '').toUpperCase()}
             </p>
          </div>
        )}
      </div>

      <div style={{marginTop:'30px'}}>
        <label className="customer-login-label">Notes / Terms</label>
        <textarea className="customer-login-input" style={{height:'80px',resize:'none',cursor:'default',fontFamily:'inherit'}} value={quote.notes || ''} readOnly />
      </div>

      {(quote.customer_signature || quote.client_signature) && (
        <div style={{marginBottom:'30px'}}>
          <label className="customer-login-label">Digital Signature</label>
          <img style={{border:'1px solid #ccc',borderRadius:'4px',maxWidth:'400px',width:'100%',background:'#f9f9f9',padding:'10px',display:'block'}}
            src={quote.customer_signature||quote.client_signature} alt="Signature" />
        </div>
      )}
    </div>
  );
};

export default ServiceRequestDetailPage;
