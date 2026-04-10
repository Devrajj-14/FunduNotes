import apiClient from '../utils/apiClient';

/**
 * Note service — all note-related API calls.
 * Matches backend: /api/notes/*
 */

export const createNote = (data) =>
  apiClient.post('/api/notes', data);

export const getAllNotes = () =>
  apiClient.get('/api/notes');

export const pinNote = (noteId) =>
  apiClient.patch(`/api/notes/${noteId}/pin`);

export const unpinNote = (noteId) =>
  apiClient.patch(`/api/notes/${noteId}/unpin`);

export const archiveNote = (noteId) =>
  apiClient.patch(`/api/notes/${noteId}/archive`);

export const unarchiveNote = (noteId) =>
  apiClient.patch(`/api/notes/${noteId}/unarchive`);

export const trashNote = (noteId) =>
  apiClient.patch(`/api/notes/${noteId}/trash`);

export const restoreNote = (noteId) =>
  apiClient.patch(`/api/notes/${noteId}/restore`);
