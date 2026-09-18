import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import { NoteList } from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';
import { useState } from 'react';
import { fetchNotes } from '../../services/noteService';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';
import { useDebouncedCallback } from 'use-debounce';
import { SearchBox } from '../SearchBox/SearchBox';
import css from './App.module.css';


export const NoteItem = ({ note }: { note: Note }) => {
	const queryClient = useQueryClient();
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteNote(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
	});
	return (
	  <div>
		<h3>{note.title}</h3>
		<button 
		  onClick={() => deleteMutation.mutate(note.id)}
		  disabled={deleteMutation.isPending}
		  >
		  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
		</button>
	  </div>
	);
};

export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Стан для виконання query
  const [inputValue, setInputValue] = useState<string>(''); // Стан для контрольованого input
  const perPage = 12;
	
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300)
  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () => fetchNotes(page, perPage, ''),
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;



  return (
    <div className={css.app}>
      <header className={css.toolbar}>
			  <h1>NoteHub</h1>
			  <SearchBox value={inputValue} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Failed to load notes.</p>}

        {!isLoading && !isError && <NoteList notes={notes} />}

        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </main>
    </div>
  );
}