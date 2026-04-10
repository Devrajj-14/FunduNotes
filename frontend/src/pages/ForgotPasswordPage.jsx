import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import { validateEmail } from '../utils/validators';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }

    setLoading(true);
    setApiError('');
    setSuccess('');
    try {
      const res = await forgotPassword({ email });
      setSuccess(res.data.message || 'OTP sent to your email.');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">📝 Fundoo Notes</h1>
        <h2 className="auth-subtitle">Forgot Password</h2>
        <p className="auth-desc">Enter your email to receive a password reset OTP.</p>

        {success && <div className="api-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); setApiError(''); }}
              placeholder="you@example.com" autoFocus />
            {error && <span className="field-error">{error}</span>}
          </div>

          {apiError && <div className="api-error">{apiError}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/reset-password">Have an OTP? Reset password</Link>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
