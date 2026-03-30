export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
}

export type CreateBookDto = Omit<Book, 'id'>;
export type UpdateBookDto = Book;
