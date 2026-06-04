import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerJobs } from '../api/customerPortal';

const J_PER_PAGE = 10;

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '-';
const fmtStatus = (s) => String(s||'-').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const norm = (s) => String(s||'').trim().toLowerCase();

const jBadge = (s) => {
  const v = norm(s);
  if (v === 'completed') return 'db-badge db-badge-green';
  if (v === 'in_progress' || v === 'active') return 'db-badge db-badge-blue';
  if (v === 'pending') return 'db-badge db-badge-yellow';
  if (v === 'cancelled') return 'db-badge db-badge-red';
  return 'db-badge db-badge-gray';
};

const JobsListPage = () => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [jPage, setJPage]     = useState(1);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const payload = await getCustomerJobs();
        setJobs(Array.isArray(payload) ? payload : []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader fullPage />;

  const paged = jobs.slice((jPage-1)*J_PER_PAGE, jPage*J_PER_PAGE);

  return (
    <div className="db-wrap">
      <div className="db-topbar">
        <div>
          <h1 className="db-title">Jobs</h1>
          <p className="db-subtitle">View and track all your jobs</p>
        </div>
      </div>

      {error && <div className="customer-login-alert">{error}</div>}

      <div className="db-card" style={{ minHeight: 'calc(100vh - 190px)', display: 'flex', flexDirection: 'column' }}>

      <div className="db-jobs-table-wrap" style={{flex: 1}}>
        <table className="db-table" style={{tableLayout:'fixed',width:'100%'}}>
          <thead>
            <tr>
              <th style={{width:'140px'}}>JOB #</th>
              <th>TITLE</th>
              <th style={{width:'120px'}}>WORK TYPE</th>
              <th style={{width:'120px'}}>START DATE</th>
              <th style={{width:'120px'}}>STATUS</th>
              <th style={{width:'130px'}}>TOTAL AMOUNT</th>
              <th style={{width:'80px'}}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={7} className="db-empty">No jobs found.</td></tr>
            )}
            {paged.map((j) => (
              <tr key={j.id}>
                <td style={{whiteSpace:'nowrap'}}>{j.job_number || '-'}</td>
                <td style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{j.title || j.name || '-'}</td>
                <td style={{whiteSpace:'nowrap'}}>{String(j.work_type || 'General').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</td>
                <td style={{whiteSpace:'nowrap'}}>{j.start_date || '-'}</td>
                <td><span className={jBadge(j.status)}>{fmtStatus(j.status)}</span></td>
                <td style={{whiteSpace:'nowrap', fontWeight:500}}>{j.formatted_total || '-'}</td>
                <td><Link className="db-btn" to={`/jobs/${j.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{marginTop: '20px', padding: '0 24px 24px 24px'}}>
        <Pagination page={jPage} total={jobs.length} perPage={J_PER_PAGE} onPage={setJPage} />
      </div>
    </div>
    </div>
  );
};

export default JobsListPage;
