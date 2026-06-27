import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './LoginPage.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
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
      await apiClient.post('/api/v1/customer/forgot-password', { email: email.trim() }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess('If an account exists with this email, you will receive a password reset link shortly.');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-login-page">
      <div className="customer-login-card animate-fade-in-up">
        <button
          type="button"
          className="customer-login-back-button"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>

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

        <h1 className="customer-login-title">Forgot Password</h1>
        <p className="customer-login-subtitle">Enter your email and we'll send you a password reset link.</p>

        {success ? <div className="customer-login-success">{success}</div> : null}
        {error ? <div className="customer-login-alert">{error}</div> : null}

        <form onSubmit={handleSubmit} className="customer-login-form" noValidate>
          <label className="customer-login-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`customer-login-input ${error ? 'has-error' : ''}`}
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="submit" className="customer-login-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
