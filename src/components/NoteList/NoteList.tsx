import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
}

export const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (notes.length === 0) {
    return <p className={css.empty}>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <button
            type="button"
            onClick={() => deleteMutation.mutate(note.id)}
            disabled={deleteMutation.isPending && deleteMutation.variables === note.id}
          >
            {deleteMutation.isPending && deleteMutation.variables === note.id
              ? 'Deleting...'
              : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  );
};