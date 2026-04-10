import apiClient from '../utils/apiClient';

/**
 * Reminder service — reminder API calls.
 * Matches backend: /api/reminders/*
 */

export const createReminder = (data) =>
  apiClient.post('/api/reminders', data);

export const getAllReminders = () =>
  apiClient.get('/api/reminders');
