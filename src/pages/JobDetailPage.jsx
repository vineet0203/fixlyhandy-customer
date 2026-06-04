import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerJobById } from '../api/customerPortal';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const payload = await getCustomerJobById(id);
        setJob(payload);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch job details.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  if (loading) return <div className="customer-page-card"><p>Loading job details...</p></div>;
  if (!job) return <div className="customer-page-card"><p>Job not found.</p></div>;

  return (
    <div className="customer-page-card">
      <button 
        type="button" 
        onClick={() => navigate('/jobs')} 
        style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:'#3B6FD4',fontWeight:600,fontSize:'14px',cursor:'pointer',marginBottom:'16px',padding:0}}
      >
        ← Back to Jobs
      </button>

      <h1 className="customer-page-title">Job Detail</h1>

      {error && <div className="customer-login-alert">{error}</div>}

      {/* Main Details Grid */}
      <div className="customer-detail-grid" style={{marginBottom:'20px'}}>
        <div><label className="customer-login-label">Job Number</label><input className="customer-login-input" value={job.job_number || ''} disabled /></div>
        <div><label className="customer-login-label">Title</label><input className="customer-login-input" value={job.title || ''} disabled /></div>
        <div><label className="customer-login-label">Status</label><input className="customer-login-input" value={job.status || ''} disabled /></div>
        <div><label className="customer-login-label">Priority</label><input className="customer-login-input" value={job.priority || ''} disabled /></div>
        
        <div><label className="customer-login-label">Work Type</label><input className="customer-login-input" value={job.work_type || 'General'} disabled /></div>
        <div><label className="customer-login-label">Issue Date</label><input className="customer-login-input" value={job.issue_date || '-'} disabled /></div>
        <div><label className="customer-login-label">Start Date</label><input className="customer-login-input" value={job.start_date || '-'} disabled /></div>
        <div><label className="customer-login-label">End Date</label><input className="customer-login-input" value={job.end_date || '-'} disabled /></div>
      </div>

      {job.description && (
        <div style={{marginBottom:'20px'}}>
          <label className="customer-login-label">Description</label>
          <textarea className="customer-login-input" style={{height:'60px',resize:'none',cursor:'default',fontFamily:'inherit'}} value={job.description} readOnly />
        </div>
      )}

      {/* Financials, Client Info & Assignment Row */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px'}}>
        <div style={{flex: '1 1 300px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3 style={{fontSize:'16px', margin:'0 0 12px 0', color:'#111827'}}>Financial Summary</h3>
          <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
            <span style={{color:'#6b7280'}}>Total Amount:</span>
            <span style={{fontWeight:600}}>{job.formatted_total || '-'}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
            <span style={{color:'#6b7280'}}>Paid Amount:</span>
            <span style={{fontWeight:600}}>{job.currency || '$'} {Number(job.paid_amount || 0).toFixed(2)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderTop:'1px solid #e5e7eb',marginTop:'4px'}}>
            <span style={{color:'#111827', fontWeight:600}}>Balance Due:</span>
            <span style={{color:'#d14343', fontWeight:700}}>{job.formatted_balance || '-'}</span>
          </div>
        </div>

        {job.latest_assignment && (
          <div style={{flex: '1 1 300px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize:'16px', margin:'0 0 12px 0', color:'#111827'}}>Assigned Employee</h3>
            <div style={{marginBottom: '6px'}}><span style={{color:'#6b7280'}}>Name:</span> <span style={{fontWeight:500}}>
              {job.latest_assignment.employee_name || '-'}
            </span></div>
            {job.latest_assignment.assigned_at && (
              <div style={{marginBottom: '6px'}}><span style={{color:'#6b7280'}}>Assigned On:</span> <span style={{fontWeight:500}}>{job.latest_assignment.assigned_at}</span></div>
            )}
            {job.latest_assignment.shift && (
              <div style={{marginBottom: '6px'}}><span style={{color:'#6b7280'}}>Shift:</span> <span style={{fontWeight:500, textTransform:'capitalize'}}>{job.latest_assignment.shift}</span></div>
            )}
          </div>
        )}
      </div>

      {/* Tasks Table */}
      <h3 className="customer-page-title" style={{fontSize:'18px'}}>Job Tasks</h3>
      <div className="customer-table-wrap" style={{marginBottom:'30px'}}>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Task Details</th>
            </tr>
          </thead>
          <tbody>
            {(job.tasks?.length > 0) ? job.tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <div style={{fontWeight: 500, color: task.completed ? '#6b7280' : '#111827', textDecoration: task.completed ? 'line-through' : 'none'}}>
                    {task.name}
                  </div>
                  {task.description && (
                    <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                      {task.description}
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td style={{textAlign:'center', color: '#6b7280', padding: '16px'}}>No tasks assigned to this job.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Schedules Table */}
      <h3 className="customer-page-title" style={{fontSize:'18px'}}>Schedules</h3>
      <div className="customer-table-wrap" style={{marginBottom:'30px'}}>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(job.schedules?.length > 0) ? job.schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.schedule_date || '-'}</td>
                <td>{schedule.start_time || '-'}</td>
                <td>{schedule.end_time || '-'}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: schedule.status === 'completed' ? '#d1fae5' : '#f3f4f6',
                    color: schedule.status === 'completed' ? '#065f46' : '#374151'
                  }}>
                    {(schedule.status || 'Scheduled').toUpperCase()}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{textAlign:'center', color: '#6b7280', padding: '16px'}}>No schedules booked.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Additional Instructions & Notes */}
      {(job.instructions || job.notes) && (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px'}}>
          {job.instructions && (
            <div style={{flex: '1 1 300px'}}>
              <label className="customer-login-label">Special Instructions</label>
              <textarea className="customer-login-input" style={{height:'80px',resize:'none',cursor:'default',fontFamily:'inherit'}} value={job.instructions} readOnly />
            </div>
          )}
          {job.notes && (
            <div style={{flex: '1 1 300px'}}>
              <label className="customer-login-label">Internal Notes</label>
              <textarea className="customer-login-input" style={{height:'80px',resize:'none',cursor:'default',fontFamily:'inherit'}} value={job.notes} readOnly />
            </div>
          )}
        </div>
      )}

      {/* Attachments Section */}
      {(job.attachments_by_context?.general?.length > 0 || job.attachments_by_context?.instructions?.length > 0) && (
        <div style={{marginBottom:'30px'}}>
          <h3 className="customer-page-title" style={{fontSize:'18px'}}>Attachments</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {[...(job.attachments_by_context?.general || []), ...(job.attachments_by_context?.instructions || [])].map((att) => (
              <a 
                key={att.id} 
                href={att.url || '#'} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
                  border: '1px solid #d1d5db', borderRadius: '6px', textDecoration: 'none', 
                  color: '#3b82f6', fontSize: '14px', backgroundColor: '#f9fafb'
                }}
              >
                📄 {att.file_name || 'Document'}
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetailPage;
