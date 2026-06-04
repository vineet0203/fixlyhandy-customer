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
      <div className="customer-login-card">
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

          <button className="customer-login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;