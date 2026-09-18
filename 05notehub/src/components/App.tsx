import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { deleteNote } from '../components/services/noteService';
import type { Note } from '../components/types/note';
import { NoteList } from '../components/NoteList';
import { Pagination } from '../components/Pagination';
import { useState } from 'react';
import { fetchNotes, createNote } from '../components/services/noteService';
import { Modal } from '../components/Modal';
import { NoteForm } from './NoteForm';
import { useDebouncedCallback } from 'use-debounce';
import { SearchBox } from './SearchBox';
import css from './App.module.css';


const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
	baseURL: 'https://notehub-public.goit.study/api/auth',
	headers: {
		Authorization: `Bearer ${token}`
  }
});

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

	const queryClient = useQueryClient();

	const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page],
    queryFn: () => fetchNotes(page, perPage, ''),
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

	
	  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
	  });
const handleCreateNote = () => {
  mutation.mutate({
    title: "Нова нотатка",
    content: "Текст нової нотатки...",
    tag: "Work", // якщо є теги за ТЗ
  });
};


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
			  <h1>NoteHub</h1>
			  <SearchBox value={inputValue} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* Модалка з формою */}
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