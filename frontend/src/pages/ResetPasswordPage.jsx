import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { validateEmail, validateOtp, validatePassword } from '../utils/validators';
import './AuthPages.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    errs.email = validateEmail(form.email);
    errs.otp = validateOtp(form.otp);
    errs.newPassword = validatePassword(form.newPassword);
    setErrors(errs);
    return !errs.email && !errs.otp && !errs.newPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      const res = await resetPassword(form);
      setSuccess(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">📝 Fundoo Notes</h1>
        <h2 className="auth-subtitle">Reset Password</h2>

        {success && <div className="api-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" autoFocus />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="otp">OTP (6 digits)</label>
            <input id="otp" name="otp" value={form.otp}
              onChange={handleChange} placeholder="123456" maxLength={6} />
            {errors.otp && <span className="field-error">{errors.otp}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" name="newPassword" type="password" value={form.newPassword}
              onChange={handleChange} placeholder="Min. 8 characters" />
            {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
          </div>

          {apiError && <div className="api-error">{apiError}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Need an OTP?</Link>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
