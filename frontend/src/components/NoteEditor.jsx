import { useState } from 'react';
import './NoteEditor.css';

/**
 * Note creation form that expands on focus (Google Keep style).
 * Props:
 *   onCreateNote(data) — called with { title, description }
 */
export default function NoteEditor({ onCreateNote }) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() && !description.trim()) {
      setError('Title or description is required');
      return;
    }
    setError('');
    try {
      await onCreateNote({
        title: title.trim() || 'Untitled',
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      setExpanded(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note');
    }
  };

  const handleClose = () => {
    if (title.trim() || description.trim()) {
      handleSubmit();
    } else {
      setExpanded(false);
    }
  };

  if (!expanded) {
    return (
      <div className="note-editor-collapsed" onClick={() => setExpanded(true)}>
        <span>Take a note...</span>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <input
        type="text"
        className="note-editor-title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="note-editor-body"
        placeholder="Take a note..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      {error && <p className="note-editor-error">{error}</p>}
      <div className="note-editor-actions">
        <button className="btn-close" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
