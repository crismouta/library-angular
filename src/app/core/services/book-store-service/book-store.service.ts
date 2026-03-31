import { computed, inject, Injectable, signal } from '@angular/core';
import { Book, CreateBookDto, UpdateBookDto } from '../../../features/books/models/book.model';
import { BookApiService } from '../book-api-service/book-api.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

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

  init(): void {
    this.loadBooks();
  }

  findBookById(id: string): Book | undefined {
    return this._books().find((book) => book.id === id);
  }

  isBookSelected(id: string): boolean {
    return this._selectedBookIds().has(id);
  }

  loadBooks(): void {
    this.startLoading();

    this.bookApiService
      .getBooks()
      .pipe(finalize(() => this.finishLoading()))
      .subscribe({
        next: (books) => this._books.set(books),
        error: () => this._error.set('Failed to load books.'),
      });
  }

  ensureBookLoaded(id: string): void {
    if (this.hasBook(id)) {
      return;
    }

    this.startLoading();

    this.bookApiService
      .getBookById(id)
      .pipe(finalize(() => this.finishLoading()))
      .subscribe({
        next: (book) => this.upsertBook(book),
        error: () => this.setLoadBookError(),
      });
  }

  private hasBook(id: string): boolean {
    return this.findBookById(id) !== undefined;
  }

  private startLoading(): void {
    this._isLoading.set(true);
    this._error.set(null);
  }

  private finishLoading(): void {
    this._isLoading.set(false);
  }

  private upsertBook(book: Book): void {
    this._books.update((current) => {
      const alreadyExists = current.some((item) => item.id === book.id);

      if (alreadyExists) {
        return current.map((item) => (item.id === book.id ? book : item));
      }

      return [...current, book];
    });
  }

  private setLoadBookError(): void {
    this._error.set('Failed to load the book.');
  }

  addBook(book: CreateBookDto, onSuccess?: () => void): void {
    this._error.set(null);

    this.bookApiService.createBook(book).subscribe({
      next: (createdBook) => {
        this.upsertBook(createdBook);
        onSuccess?.();
      },
      error: () => {
        this._error.set('Could not add the book');
      }
    });
  }

  updateBook(bookId: string, book: UpdateBookDto): void {
    this._error.set(null);

    this.bookApiService.updateBook(bookId, book).subscribe({
      next: (updatedBook) => this.upsertBook(updatedBook),
      error: () => {
        this._error.set('Could not update the book');
      }
    })
  }

  deleteBook(id: string): void {
    this._error.set(null);

    this.bookApiService.deleteBook(id).subscribe({
      next: () => {
        this._books.update((current) => current.filter((book) => book.id !== id));
        this._selectedBookIds.update((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        })
      },
      error: () => {
        this._error.set('Could not delete the book');
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