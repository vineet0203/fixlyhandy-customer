import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import './LoginPage.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!token) {
      setError('Reset token is missing from the URL.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess('');
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await apiClient.post('/api/v1/customer/reset-password', {
        token,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Your password has been reset successfully.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-login-page">
      <div className="customer-login-card animate-fade-in-up">
        {/* FixlyHandy Logo Branding */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              if (window.location.port === '5174' || window.location.port === '5175') {
                window.location.href = `http://${window.location.hostname}:5173`;
              } else {
                window.location.href = '/';
              }
            }} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', height: '44px', width: '44px', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: '#fff3cd', color: '#0F2744' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 12V22H22V12L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ lineHeight: 1, paddingTop: '4px', textAlign: 'left' }}>
              <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.02em', color: '#0F2744', fontFamily: 'Poppins, sans-serif' }}>
                Trak<span style={{ color: '#ffb800' }}>Jobs</span>
              </span>
              <div style={{ marginTop: '2px', fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Fix it. Right. On time.
              </div>
            </div>
          </a>
        </div>

        <h1 className="customer-login-title">Reset Password</h1>
        <p className="customer-login-subtitle">Enter a new secure password for your account.</p>

        {success ? <div className="customer-login-success">{success}</div> : null}
        {error ? <div className="customer-login-alert">{error}</div> : null}

        {!token && <div className="customer-login-alert">No reset token detected in the URL. Please verify the link.</div>}

        <form onSubmit={handleSubmit} className="customer-login-form" noValidate>
          <label className="customer-login-label" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className="customer-login-input"
            placeholder="Enter new password (min. 8 chars)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!token || loading}
          />

          <label className="customer-login-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="customer-login-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={!token || loading}
          />

          <button type="submit" className="customer-login-button" disabled={!token || loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
