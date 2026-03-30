import { Component, inject, signal } from '@angular/core';
import { BooksService } from '../../services/books-service';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  private booksService = inject(BooksService);
  private refresh = signal(0);

  books = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.booksService.getBooks())
    ),
    { initialValue: [] }
  );

  deleteBook(id: string) {
    this.booksService.delete(id).subscribe(() => {
      this.refresh.update(v => v + 1);
    });
  };

  addBook(title: string, author: string, category: string) {
    const newBook = { title, author, category };

    this.booksService.addBook(newBook).subscribe(() => {
      this.refresh.update(v => v + 1);
    });
  }
}
