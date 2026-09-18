import axios from 'axios';
import type { FetchNotesResponse, Note, NewNote } from '../types/note';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
	baseURL: 'https://notehub-public.goit.study/api/auth',
	headers: {
		Authorization: `Bearer ${token}`
  }
});

export const fetchNotes = async (
    page: number = 1,
    perPage: number = 12,
    search: string = ''
): Promise<FetchNotesResponse> => {
    const response = await api.get<FetchNotesResponse>('/notes', {
        params: {
            page,
            perPage,
            search,
        },
    });
    return response.data;
};

export const createNote = async (NoteData: NewNote): Promise <Note> => {
    const response = await api.post<Note>('notes', NoteData);
    return response.data;
}

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};