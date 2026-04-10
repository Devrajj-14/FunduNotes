import { useNotes } from '../hooks/useNotes';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';
import './DashboardPage.css';

/**
 * Dashboard page — shows active notes (not archived, not trashed).
 * Manages note creation and all note action handlers.
 */
export default function DashboardPage({ searchQuery = '' }) {
  const {
    activeNotes, loading, error,
    createNote, pinNote, unpinNote, archiveNote, trashNote,
  } = useNotes(searchQuery);

  if (loading) return <div className="page-status">Loading notes...</div>;
  if (error) return <div className="page-status error">{error}</div>;

  return (
    <div className="dashboard-page">
      <NoteEditor onCreateNote={createNote} />
      <NoteList
        notes={activeNotes}
        view="active"
        emptyMessage="No notes yet. Create one above!"
        onPin={pinNote}
        onUnpin={unpinNote}
        onArchive={archiveNote}
        onTrash={trashNote}
      />
    </div>
  );
}
