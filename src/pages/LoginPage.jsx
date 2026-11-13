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
  const homepageUrl = import.meta.env.DEV
    ? `${window.location.protocol}//${window.location.hostname}:5173`
    : 'https://fixlyhandy.com';

  // WhatsApp Login States
  const [showWhatsappLogin, setShowWhatsappLogin] = useState(false);
  const [showWhatsappOtp, setShowWhatsappOtp] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappOtp, setWhatsappOtp] = useState(['', '', '', '', '', '']);
  const [whatsappDebugOtp, setWhatsappDebugOtp] = useState('');

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

  const handleLoginSuccess = (token, customer) => {
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_profile', JSON.stringify(customer || {}));
    localStorage.setItem('role', customer?.role || 'customer');

    // Redirect to /verify if the account is not verified
      navigate("/dashboard", { replace: true });
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

      handleLoginSuccess(token, customer);
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

  const handleGoogleLogin = async () => {
    setApiError('');
    const mockEmail = window.prompt(
      'Enter Google email or token to login (e.g. mock_yourname@gmail.com for simulated mode):',
      'mock_customer@gmail.com'
    );
    if (!mockEmail) return;

    setLoading(true);
    try {
      const tokenVal = mockEmail.includes('@') && !mockEmail.startsWith('mock_')
        ? `mock_${mockEmail}`
        : mockEmail;

      const response = await apiClient.post('/auth/login/google', {
        id_token: tokenVal,
        type: 'customer',
      });

      if (response.data.success) {
        const { token, customer } = response.data.data;
        handleLoginSuccess(token, customer);
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsappSendOtp = async (event) => {
    event.preventDefault();
    setApiError('');
    if (!whatsappNumber.trim()) {
      setApiError('Please enter a WhatsApp number.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login/whatsapp', {
        whatsapp_number: whatsappNumber.trim(),
        type: 'customer',
      });

      if (response.data.success) {
        setShowWhatsappOtp(true);
        if (response.data.data?.otp) {
          setWhatsappDebugOtp(response.data.data.otp);
        }
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/[^0-9]/.test(value) && value !== '') return;
    const newOtp = [...whatsappOtp];
    newOtp[index] = value.substring(value.length - 1);
    setWhatsappOtp(newOtp);

    // Shift focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !whatsappOtp[index] && index > 0) {
      const prevInput = document.getElementById(`login-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleWhatsappVerifyOtp = async (event) => {
    event.preventDefault();
    setApiError('');
    const otpValue = whatsappOtp.join('');
    if (otpValue.length < 6) {
      setApiError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login/whatsapp', {
        whatsapp_number: whatsappNumber.trim(),
        otp: otpValue,
        type: 'customer',
      });

      if (response.data.success) {
        const { token, customer } = response.data.data;
        handleLoginSuccess(token, customer);
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'WhatsApp login verification failed.');
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
            if (showWhatsappLogin) {
              if (showWhatsappOtp) {
                setShowWhatsappOtp(false);
              } else {
                setShowWhatsappLogin(false);
              }
              setApiError('');
              return;
            }
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
            href={homepageUrl}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', height: '44px', width: '44px', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: '#fff3cd', color: '#0F2744' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 12V22H22V12L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* Conditional form rendering: WhatsApp vs Email/Password */}
        {!showWhatsappLogin ? (
          <>
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

            <div className="mt-6 border-t pt-6" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p className="text-center text-sm text-gray-500 mb-4" style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Or sign in with</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  style={{ width: '100%', padding: '10px', border: '1px solid #fca5a5', borderRadius: '12px', background: '#fff', fontWeight: 'bold', color: '#475569', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <img src="https://www.google.com/favicon.ico" style={{ width: '18px', height: '18px' }} alt="Google Icon" />
                  Sign in with Gmail
                </button>
                <button
                  onClick={() => { setShowWhatsappLogin(true); setApiError(''); }}
                  type="button"
                  style={{ width: '100%', padding: '10px', border: '1px solid #86efac', borderRadius: '12px', background: '#fff', fontWeight: 'bold', color: '#475569', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <svg style={{ width: '18px', height: '18px', color: '#22c55e' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.407 9.864-9.822.002-2.623-1.02-5.09-2.877-6.949-1.856-1.857-4.325-2.88-6.953-2.882-5.437 0-9.862 4.408-9.866 9.825-.001 1.83.5 3.61 1.45 5.178l-.95 3.47 3.562-.934zM17.91 14.8c-.324-.162-1.916-.946-2.21-1.054-.294-.108-.507-.162-.72.162-.213.324-.827 1.054-1.012 1.27-.185.216-.37.243-.694.08-1.748-.872-2.903-1.416-4.053-2.392-.303-.257-.59-.576-.856-.96-.185-.324-.02-.5-.182-.661-.146-.145-.324-.378-.486-.567-.162-.189-.216-.324-.324-.54-.108-.216-.054-.405-.027-.567.027-.162.216-.513.324-.675.108-.162.145-.27.216-.405.072-.135.036-.252-.018-.405-.054-.153-.507-1.224-.694-1.674-.183-.44-.367-.38-.507-.387-.13-.006-.28-.008-.43-.008-.15 0-.395.056-.602.28-.206.225-.79.771-.79 1.882 0 1.111.808 2.186.918 2.337.112.15 1.59 2.429 3.85 3.407.537.233 1.002.38 1.343.488.54.172 1.03.148 1.417.09.43-.064 1.32-.54 1.506-1.06.185-.52.185-.966.13-.1.056-.05.216-.243.324-.405z" />
                  </svg>
                  Sign in with WhatsApp
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            {!showWhatsappOtp ? (
              <form className="customer-login-form" onSubmit={handleWhatsappSendOtp}>
                <label className="customer-login-label" htmlFor="whatsapp_number">WhatsApp Number</label>
                <input
                  id="whatsapp_number"
                  type="tel"
                  className="customer-login-input"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+1 WhatsApp Number"
                  disabled={loading}
                />
                <button className="customer-login-button" type="submit" disabled={loading || !whatsappNumber}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowWhatsappLogin(false); setApiError(''); }}
                  style={{ width: '100%', marginTop: '12px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff', color: '#64748b', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                >
                  Back to Email Login
                </button>
              </form>
            ) : (
              <form className="customer-login-form" onSubmit={handleWhatsappVerifyOtp}>
                <label className="customer-login-label">Enter Verification Code</label>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>A 6-digit code has been sent to {whatsappNumber}</p>

                {/* Display OTP helper in Dev Mode */}
                {whatsappDebugOtp && (
                  <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '12px', color: '#92400e', fontSize: '12px', marginBottom: '12px', border: '1px solid #fde68a' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Dev/Mock Mode OTP: <span style={{ fontSize: '14px', letterSpacing: '2px', color: '#1e293b' }}>{whatsappDebugOtp}</span></p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                  {whatsappOtp.map((val, idx) => (
                    <input
                      key={idx}
                      id={`login-otp-${idx}`}
                      type="text"
                      maxLength="1"
                      style={{ width: '38px', height: '44px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={loading}
                    />
                  ))}
                </div>

                <button className="customer-login-button" type="submit" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowWhatsappOtp(false); setApiError(''); }}
                  style={{ width: '100%', marginTop: '12px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#fff', color: '#64748b', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                >
                  Back to Number Entry
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;