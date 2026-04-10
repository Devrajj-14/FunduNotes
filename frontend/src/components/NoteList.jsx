import NoteCard from './NoteCard';
import './NoteList.css';

/**
 * Renders a grid of NoteCards.
 * Sorts pinned notes first for active view.
 *
 * Props:
 *   notes — array of note objects
 *   view — 'active' | 'archive' | 'trash'
 *   emptyMessage — message when no notes
 *   action handlers — passed through to NoteCard
 */
export default function NoteList({
  notes,
  view = 'active',
  emptyMessage = 'No notes found',
  onPin, onUnpin, onArchive, onUnarchive, onTrash, onRestore,
}) {
  if (!notes || notes.length === 0) {
    return <div className="note-list-empty">{emptyMessage}</div>;
  }

  // Sort: pinned first for active view
  const sorted = view === 'active'
    ? [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    : notes;

  return (
    <div className="note-list-grid">
      {sorted.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          view={view}
          onPin={onPin}
          onUnpin={onUnpin}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onTrash={onTrash}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}
