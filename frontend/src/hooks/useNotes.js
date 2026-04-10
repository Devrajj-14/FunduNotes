import { useState, useEffect, useCallback } from 'react';
import * as noteService from '../services/noteService';

/**
 * Custom hook for notes data management.
 * Fetches all notes and provides action handlers.
 * Filters notes by view (active/archived/trashed) and search query.
 */
export function useNotes(externalSearchQuery = '') {
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await noteService.getAllNotes();
      setAllNotes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Filter helpers
  const activeNotes = allNotes.filter(n => !n.archived && !n.trashed);
  const archivedNotes = allNotes.filter(n => n.archived && !n.trashed);
  const trashedNotes = allNotes.filter(n => n.trashed);

  // Search filter (client-side)
  const filterBySearch = (notes) => {
    if (!externalSearchQuery.trim()) return notes;
    const q = externalSearchQuery.toLowerCase();
    return notes.filter(n =>
      n.title?.toLowerCase().includes(q) ||
      n.description?.toLowerCase().includes(q)
    );
  };

  // Action handlers
  const createNote = async (data) => {
    const res = await noteService.createNote(data);
    setAllNotes(prev => [res.data, ...prev]);
    return res.data;
  };

  const pinNote = async (id) => {
    const res = await noteService.pinNote(id);
    setAllNotes(prev => prev.map(n => n.id === id ? res.data : n));
  };

  const unpinNote = async (id) => {
    const res = await noteService.unpinNote(id);
    setAllNotes(prev => prev.map(n => n.id === id ? res.data : n));
  };

  const archiveNote = async (id) => {
    const res = await noteService.archiveNote(id);
    setAllNotes(prev => prev.map(n => n.id === id ? res.data : n));
  };

  const unarchiveNote = async (id) => {
    const res = await noteService.unarchiveNote(id);
    setAllNotes(prev => prev.map(n => n.id === id ? res.data : n));
  };

  const trashNote = async (id) => {
    const res = await noteService.trashNote(id);
    setAllNotes(prev => prev.map(n => n.id === id ? res.data : n));
  };

  const restoreNote = async (id) => {
    const res = await noteService.restoreNote(id);
    setAllNotes(prev => prev.map(n => n.id === id ? res.data : n));
  };

  return {
    allNotes,
    activeNotes: filterBySearch(activeNotes),
    archivedNotes: filterBySearch(archivedNotes),
    trashedNotes: filterBySearch(trashedNotes),
    loading,
    error,
    fetchNotes,
    createNote,
    pinNote,
    unpinNote,
    archiveNote,
    unarchiveNote,
    trashNote,
    restoreNote,
  };
}
