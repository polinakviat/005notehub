export interface Note {
    id: string;
    title: string
    content: string;
    tag?: string;
}

export interface NewNote {
    title: string;
    content: string;
    tag?: string;
}

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}