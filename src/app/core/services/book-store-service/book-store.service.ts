import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, CreateBookDto, UpdateBookDto } from '../../../features/books/models/book.model';
import { BookApiService } from '../book-api-service/book-api.service';

@Injectable({
  providedIn: 'root',
})
export class BookStoreService {
  private readonly bookApiService = inject(BookApiService);

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

    this.bookApiService.getBooks().subscribe({
      next: (books) => {
        this._books.set(books);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Failed to load books.');
        this._isLoading.set(false);
      }
    })
  }

  addBook(book: CreateBookDto): void {
    this._error.set(null);

    this.bookApiService.createBook(book).subscribe({
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

    this.bookApiService.updateBook(book).subscribe({
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

    this.bookApiService.deleteBook(id).subscribe({
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