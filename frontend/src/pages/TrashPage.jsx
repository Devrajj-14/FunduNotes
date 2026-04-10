import { useNotes } from '../hooks/useNotes';
import NoteList from '../components/NoteList';
import './DashboardPage.css';

/**
 * Trash page — shows trashed notes with restore action.
 */
export default function TrashPage({ searchQuery = '' }) {
  const { trashedNotes, loading, error, restoreNote } = useNotes(searchQuery);

  if (loading) return <div className="page-status">Loading trashed notes...</div>;
  if (error) return <div className="page-status error">{error}</div>;

  return (
    <div className="dashboard-page">
      <h2 className="page-title">🗑️ Trash</h2>
      <NoteList
        notes={trashedNotes}
        view="trash"
        emptyMessage="Trash is empty"
        onRestore={restoreNote}
      />
    </div>
  );
}
