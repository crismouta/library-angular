import { inject, Injectable } from '@angular/core';
import { Book } from '../intefaces/book';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  /* books: Book[] = [
    {
      id: '1',
      title: 'Title 1',
      author: 'Author 1',
      category: 'Category 1'
    },
    {
      id: '2',
      title: 'Title 2',
      author: 'Author 2',
      category: 'Category 2'
    },
    {
      id: '3',
      title: 'Title 3',
      author: 'Author 3',
      category: 'Category 3'
    },
  ];

  getBooks():Book[] {
    return this.books;
  }

  getById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  } */
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/books';

  getBooks() {
    return this.http.get<Book[]>(this.API_URL);
  };

  getById(id: string) {
    return this.http.get<Book>(`${this.API_URL}/${id}`);
  };

  delete(id: string) {
    return this.http.delete<unknown>(`${this.API_URL}/${id}`);
  };

  addBook(book: Omit<Book, 'id'>) {
    return this.http.post<Book>(this.API_URL, book);
  };

  updateBook(book: Book) {
    return this.http.put<Book>(`${this.API_URL}/${book.id}`, book);
  }

}