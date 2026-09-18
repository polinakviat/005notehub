export type NoteTag = 'Todo' | 'Personal' | 'Shopping' | 'Meeting' | 'Work';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}