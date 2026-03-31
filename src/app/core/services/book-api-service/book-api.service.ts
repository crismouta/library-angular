import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, CreateBookDto, UpdateBookDto } from '../../../features/books/models/book.model';
import { BOOKS_API_URL } from '../../config/api.tokens';

@Injectable({
  providedIn: 'root',
})
export class BookApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = inject(BOOKS_API_URL);

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.apiUrl);
  }

  getBookById(bookId: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/${bookId}`);
  }

  createBook(book: CreateBookDto): Observable<Book> {
    return this.httpClient.post<Book>(this.apiUrl, book);
  }

  updateBook(bookId: string, book: UpdateBookDto): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiUrl}/${bookId}`, book);
  }

  deleteBook(bookId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${bookId}`);
  }
}
