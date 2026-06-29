import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authToken = params.get('authToken');

    if (!authToken) return;

    localStorage.setItem('customer_token', authToken);
    localStorage.setItem('role', 'customer');
    navigate('/dashboard', { replace: true });
  }, [location.search, navigate]);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/customer/login', {
        email: email.trim(),
        password,
      });

      const token = response?.data?.data?.token;
      const customer = response?.data?.data?.customer;

      if (!token) {
        throw new Error('Token not found in response.');
      }

      localStorage.setItem('customer_token', token);
      localStorage.setItem('customer_profile', JSON.stringify(customer || {}));
      localStorage.setItem('role', customer?.role || 'customer');

      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Customer login failed.';

      if (message === 'Please set your password first') {
        navigate(`/set-password?email=${encodeURIComponent(email.trim())}`, { replace: true });
        return;
      }

      setApiError(message);
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
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
              return;
            }
            navigate('/', { replace: true });
          }}
        >
          Back
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
                FixlyHandy
              </span>
              <div style={{ marginTop: '2px', fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Fix it. Right. On time.
              </div>
            </div>
          </a>
        </div>

        <h1 className="customer-login-title">Customer Login</h1>
        <p className="customer-login-subtitle">Sign in to access your customer dashboard.</p>

        {apiError ? <div className="customer-login-alert">{apiError}</div> : null}

        <form className="customer-login-form" onSubmit={handleSubmit} noValidate>
          <label className="customer-login-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`customer-login-input ${errors.email ? 'has-error' : ''}`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={validate}
            placeholder="name@example.com"
          />
          {errors.email ? <span className="customer-login-error">{errors.email}</span> : null}

          <label className="customer-login-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={`customer-login-input ${errors.password ? 'has-error' : ''}`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={validate}
            placeholder="Enter your password"
          />
          {errors.password ? <span className="customer-login-error">{errors.password}</span> : null}

          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0 8px' }}>
            <a
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
              }}
              style={{ fontSize: '13px', color: '#3574bb', textDecoration: 'none', fontWeight: 500 }}
            >
              Forgot Password?
            </a>
          </div>

          <button className="customer-login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;