import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import './SetPasswordPage.css';

const SetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email) {
      nextErrors.email = 'Missing email in setup link.';
    }

    if (!token) {
      nextErrors.token = 'Missing password setup token.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      await apiClient.post('/customer/set-password', {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });

      setSuccess('Password set successfully. Redirecting to login...');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-set-password-page">
      <div className="customer-set-password-card">
        <h1 className="customer-set-password-title">Set Password</h1>
        <p className="customer-set-password-subtitle">Create a password for your customer account.</p>

        {email ? <p className="customer-set-password-subtitle">{email}</p> : null}
        {errors.email ? <div className="customer-set-password-alert">{errors.email}</div> : null}
        {errors.token ? <div className="customer-set-password-alert">{errors.token}</div> : null}
        {apiError ? <div className="customer-set-password-alert">{apiError}</div> : null}
        {success ? <div className="customer-set-password-success">{success}</div> : null}

        <form className="customer-set-password-form" onSubmit={handleSubmit} noValidate>
          <label className="customer-set-password-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={`customer-set-password-input ${errors.password ? 'has-error' : ''}`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={validate}
            placeholder="Enter your password"
          />
          {errors.password ? <span className="customer-set-password-error">{errors.password}</span> : null}

          <label className="customer-set-password-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className={`customer-set-password-input ${errors.confirmPassword ? 'has-error' : ''}`}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onBlur={validate}
            placeholder="Confirm password"
          />
          {errors.confirmPassword ? (
            <span className="customer-set-password-error">{errors.confirmPassword}</span>
          ) : null}

          <button className="customer-set-password-button" type="submit" disabled={loading || !email || !token}>
            {loading ? 'Setting password...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;