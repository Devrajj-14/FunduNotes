import './NoteCard.css';

/**
 * Presentational note card component.
 * Receives data and action handlers via props — no direct API calls.
 *
 * Props:
 *   note — the note object
 *   onPin / onUnpin / onArchive / onUnarchive / onTrash / onRestore — action handlers
 *   view — 'active' | 'archive' | 'trash' (determines which actions to show)
 */
export default function NoteCard({ note, onPin, onUnpin, onArchive, onUnarchive, onTrash, onRestore, view = 'active' }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className={`note-card ${note.pinned ? 'pinned' : ''}`}>
      <div className="note-card-content">
        <h3 className="note-card-title">{note.title}</h3>
        {note.description && (
          <p className="note-card-desc">{note.description}</p>
        )}
      </div>

      <div className="note-card-meta">
        <span>{formatDate(note.updatedAt || note.createdAt)}</span>
        {note.pinned && <span className="pin-badge">📌 Pinned</span>}
      </div>

      <div className="note-card-actions">
        {view === 'active' && (
          <>
            {note.pinned ? (
              <button title="Unpin" onClick={() => onUnpin?.(note.id)}>📌</button>
            ) : (
              <button title="Pin" onClick={() => onPin?.(note.id)}>📍</button>
            )}
            <button title="Archive" onClick={() => onArchive?.(note.id)}>📦</button>
            <button title="Trash" onClick={() => onTrash?.(note.id)}>🗑️</button>
          </>
        )}

        {view === 'archive' && (
          <>
            <button title="Unarchive" onClick={() => onUnarchive?.(note.id)}>📤</button>
            <button title="Trash" onClick={() => onTrash?.(note.id)}>🗑️</button>
          </>
        )}

        {view === 'trash' && (
          <button title="Restore" onClick={() => onRestore?.(note.id)}>♻️</button>
        )}
      </div>
    </div>
  );
}
