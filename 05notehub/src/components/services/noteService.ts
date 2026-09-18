import axios from 'axios';
import type { FetchNotesResponse, Note, NewNote } from '../types/note';

export const fetchNotes = async (
    page: number = 1,
    perPage: number = 12,
    searchQuery: string = ''
): Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>('/notes', {
        params: {
            page,
            perPage,
            query: searchQuery,
        },
    });
    return response.data;
};

export const createNote = async (NoteData: NewNote): Promise <Note> => {
    const response = await axios.post<Note>('notes', NoteData);
    return response.data;
}

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};