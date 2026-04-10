import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    errs.firstName = validateRequired(form.firstName, 'First name');
    errs.email = validateEmail(form.email);
    errs.password = validatePassword(form.password);
    setErrors(errs);
    return !errs.firstName && !errs.email && !errs.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      await registerUser(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">📝 Fundoo Notes</h1>
        <h2 className="auth-subtitle">Create account</h2>

        {success && <div className="api-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" value={form.firstName}
              onChange={handleChange} placeholder="Your name" autoFocus />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="Min. 8 characters" />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {apiError && <div className="api-error">{apiError}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
