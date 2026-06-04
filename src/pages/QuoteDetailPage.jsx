import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerQuoteById } from '../api/customerPortal';
import apiClient from '../api/client';

const QuoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sigMode, setSigMode] = useState('draw');
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const payload = await getCustomerQuoteById(id);
        setQuote(payload);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch quote details.');
      } finally {
        setLoading(false);
      }
    };
    run();
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

  const saveSignature = async () => {
    if (!hasSig) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      await apiClient.patch(`/customer/quotes/${id}/approval`, {
        action: 'Accepted',
        customer_signature: dataUrl,
      });
      setQuote(prev => ({ ...prev, customer_signature: dataUrl, approval_status: 'accepted' }));
      setSaveMsg('Signature saved successfully!');
    } catch (e) {
      setSaveMsg(e?.response?.data?.message || 'Failed to save signature.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="customer-page-card"><p>Loading...</p></div>;
  if (!quote) return <div className="customer-page-card"><p>Quote not found.</p></div>;

  const canSign = !['accepted','rejected'].includes(String(quote.approval_status||'').toLowerCase());

  return (
    <div className="customer-page-card">
      <button type="button" onClick={() => navigate('/quotes')} style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:'#3B6FD4',fontWeight:600,fontSize:'14px',cursor:'pointer',marginBottom:'16px',padding:0}}>
        ← Back to Quotes
      </button>

      <h1 className="customer-page-title">Quote Detail</h1>
      <p className="customer-page-subtitle">View quote details (Read-Only).</p>

      {error && <div className="customer-login-alert">{error}</div>}

      <div className="customer-detail-grid" style={{marginBottom:'20px'}}>
        <div><label className="customer-login-label">Quote Number</label><input className="customer-login-input" value={quote.quote_number||''} disabled /></div>
        <div><label className="customer-login-label">Title</label><input className="customer-login-input" value={quote.title||''} disabled /></div>
        <div><label className="customer-login-label">Status</label><input className="customer-login-input" value={quote.status||''} disabled /></div>
        <div><label className="customer-login-label">Due Date</label><input className="customer-login-input" value={quote.quote_due_date||'-'} disabled /></div>
      </div>

      <h3 className="customer-page-title" style={{fontSize:'18px',marginTop:'30px'}}>Line Items</h3>
      <div className="customer-table-wrap" style={{marginBottom:'20px'}}>
        <table className="customer-table">
          <thead><tr><th>Item Name</th><th>Description</th><th>Quantity</th><th>Unit Price ({quote.currency||"$"})</th><th>Tax Rate (%)</th><th>Total ({quote.currency||"$"})</th></tr></thead>
          <tbody>
            {quote.items?.length > 0 ? quote.items.map((item,i) => (
              <tr key={i}>
                <td>{item.item_name}</td><td>{item.description||'-'}</td><td>{item.quantity}</td>
                <td>{Number(item.unit_price).toFixed(2)}</td><td>{Number(item.tax_rate).toFixed(2)}</td>
                <td>{Number(item.quantity*item.unit_price*(1+item.tax_rate/100)).toFixed(2)}</td>
              </tr>
            )) : <tr><td colSpan="6" style={{textAlign:'center'}}>No items.</td></tr>}
          </tbody>
        </table>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'30px'}}>
        <div style={{width:'300px'}}>
          {[['Subtotal',quote.subtotal],['Discount',quote.discount]].map(([l,v])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}>
              <strong>{l}:</strong><span>{quote.currency||"$"} {Number(v||0).toFixed(2)}</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'2px solid #eee',marginTop:'8px'}}>
            <strong>Total:</strong><strong>{quote.currency||"$"} {Number(quote.total_amount||0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <h3 className="customer-page-title" style={{fontSize:'18px'}}>Client Approval</h3>
      <div className="customer-detail-grid" style={{marginBottom:'20px'}}>
        <div><label className="customer-login-label">Approval Status</label><input className="customer-login-input" value={quote.approval_status||'Pending'} disabled /></div>
        <div><label className="customer-login-label">Approval Date</label><input className="customer-login-input" value={quote.approval_date||'-'} disabled /></div>
        <div><label className="customer-login-label">Approved Price ({quote.currency||"$"})</label><input className="customer-login-input" value={Number(quote.customer_approved_price||quote.total_amount||0).toFixed(2)} disabled /></div>
      </div>

      {quote.notes && (
        <div style={{marginBottom:'20px'}}>
          <label className="customer-login-label">Notes / Terms</label>
          <textarea className="customer-login-input" style={{height:'80px',resize:'none',cursor:'default',fontFamily:'inherit'}} value={quote.notes || ''} readOnly />
        </div>
      )}

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

export default QuoteDetailPage;
