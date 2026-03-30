import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, combineLatest } from 'rxjs';

@Component({
  selector: 'app-book-details',
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  private bookService = inject(BooksService);
  private router = inject(Router);
  private refresh = signal(0);

  bookId = input.required<string>();

    book = toSignal(
    combineLatest([
      toObservable(this.bookId),
      toObservable(this.refresh)
    ]).pipe(
      switchMap(([id]) =>
        this.bookService.getById(id).pipe(
          catchError(() => of(null))
        )
      )
    ),
    { initialValue: null }
  );

  deleteRequest = output<string>();

  onDelete() {
    const id = this.bookId();
    this.bookService.delete(id).subscribe({
      next: () => {
        console.log('Libro borrado');
        this.navigateToBookList();
      },
      error: (error) => console.error('Error al borrar', error)
    });
  }

  navigateToBookList() {
    this.router.navigate(['/books']);
  }

  updateBook(title: string, author: string, category: string) {
    const updatedBook = {
      id: this.bookId(),
      title,
      author,
      category
    };

    this.bookService.updateBook(updatedBook).subscribe(() => {
      this.refresh.update(v => v + 1);
    });
  }
}
