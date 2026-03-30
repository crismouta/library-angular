import { computed, inject, Injectable, signal } from '@angular/core';
import { Book, CreateBookDto, UpdateBookDto } from '../../shared/models/book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/books';

  private readonly _books = signal<Book[]>([]);
  readonly books = this._books.asReadonly();

  private readonly _selectedBookIds = signal<Set<string>>(new Set<string>());
  readonly selectedBookIds = this._selectedBookIds.asReadonly();

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly selectedCount = computed(() => this._selectedBookIds().size);
  readonly hasSelectedBooks = computed(() => this.selectedCount() > 0);

  constructor() {
    this.loadBooks();
  }

  getBookById (id: string): Book | undefined {
    return this._books().find((book) => book.id === id);
  }

  loadBooks(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.get<Book[]>(this.API_URL).subscribe({
      next: (books) => {
        this._books.set(books);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('There is no books');
        this._isLoading.set(false);
      }
    })
  }

  addBook(book: CreateBookDto): void {
    this._error.set(null);

    this.http.post<Book>(this.API_URL, book).subscribe({
      next: (createdBook) => {
        this._books.update((current) => [...current, createdBook])
      },
      error: () => {
        this._error.set('Cound not add the book');
      }
    })
  }

  updateBook(book: UpdateBookDto): void {
    this._error.set(null);

    this.http.put<Book>(`${this.API_URL}/${book.id}`, book).subscribe({
      next: (updateBook) => {
        this._books.update((current) => 
          current.map((item) => (item.id === updateBook.id ? updateBook : item))
        )
      },
      error: () => {
        this._error.set('Cound not update the book');
      }
    })
  }

  deleteBook(id: string): void {
    this._error.set(null);

    this.http.delete<void>(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this._books.update((current) => current.filter((book) => book.id != id ));
        this._selectedBookIds.update((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        })
      },
      error: () => {
        this._error.set('Cound not delete the book');
      }
    })
  }

  toggleBookSelection(id: string): void {
    this._selectedBookIds.update((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  clearSelectedBooks(): void {
    this._selectedBookIds.set(new Set<string>());
  }

  deleteSelectedBooks(): void {
    const selectedIds = [...this._selectedBookIds()];
    selectedIds.forEach((id) => this.deleteBook(id));
  }

}