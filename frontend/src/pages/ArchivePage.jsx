import { useNotes } from '../hooks/useNotes';
import NoteList from '../components/NoteList';
import './DashboardPage.css';

/**
 * Archive page — shows archived notes.
 */
export default function ArchivePage({ searchQuery = '' }) {
  const { archivedNotes, loading, error, unarchiveNote, trashNote } = useNotes(searchQuery);

  if (loading) return <div className="page-status">Loading archived notes...</div>;
  if (error) return <div className="page-status error">{error}</div>;

  return (
    <div className="dashboard-page">
      <h2 className="page-title">📦 Archive</h2>
      <NoteList
        notes={archivedNotes}
        view="archive"
        emptyMessage="No archived notes"
        onUnarchive={unarchiveNote}
        onTrash={trashNote}
      />
    </div>
  );
}
