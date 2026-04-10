import { useState, useEffect } from 'react';
import { getAllReminders, createReminder } from '../services/reminderService';
import { getAllNotes } from '../services/noteService';
import { validateFutureDate } from '../utils/validators';
import './ReminderPage.css';

/**
 * Reminder page — shows all reminders and allows creating new ones.
 */
export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [remRes, noteRes] = await Promise.all([getAllReminders(), getAllNotes()]);
      setReminders(remRes.data);
      // Only show active notes in the dropdown
      setNotes(noteRes.data.filter(n => !n.trashed));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedNoteId) { setFormError('Please select a note'); return; }
    const dateErr = validateFutureDate(reminderTime);
    if (dateErr) { setFormError(dateErr); return; }

    try {
      const res = await createReminder({
        noteId: Number(selectedNoteId),
        reminderTime: reminderTime,
      });
      setReminders(prev => [res.data, ...prev]);
      setFormSuccess('Reminder created!');
      setSelectedNoteId('');
      setReminderTime('');
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create reminder');
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '';
    return new Date(dt).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return <div className="page-status">Loading reminders...</div>;
  if (error) return <div className="page-status error">{error}</div>;

  return (
    <div className="reminder-page">
      <div className="reminder-header">
        <h2 className="page-title">🔔 Reminders</h2>
        <button className="reminder-add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Reminder'}
        </button>
      </div>

      {showForm && (
        <form className="reminder-form" onSubmit={handleCreate}>
          <select value={selectedNoteId} onChange={(e) => setSelectedNoteId(e.target.value)}>
            <option value="">Select a note...</option>
            {notes.map(n => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <button type="submit" className="reminder-submit-btn">Create</button>
          {formError && <span className="reminder-form-error">{formError}</span>}
          {formSuccess && <span className="reminder-form-success">{formSuccess}</span>}
        </form>
      )}

      {reminders.length === 0 ? (
        <div className="page-status">No reminders set</div>
      ) : (
        <div className="reminder-list">
          {reminders.map(r => (
            <div key={r.id} className={`reminder-card ${r.notified ? 'notified' : ''}`}>
              <div className="reminder-card-note">{r.noteTitle}</div>
              <div className="reminder-card-time">
                {r.notified ? '✅ ' : '⏰ '}
                {formatDateTime(r.reminderTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
