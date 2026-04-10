/**
 * Basic client-side validators for form inputs.
 * Backend validation remains the final authority.
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return '';
};

export const validateOtp = (otp) => {
  if (!otp) return 'OTP is required';
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) return 'OTP must be exactly 6 digits';
  return '';
};

export const validateFutureDate = (dateStr) => {
  if (!dateStr) return 'Date/time is required';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date';
  if (date <= new Date()) return 'Must be a future date/time';
  return '';
};
