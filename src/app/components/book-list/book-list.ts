import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books-service';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  private booksService = inject(BooksService);
  private refreshTrigger = new Subject<void>();

  //books = toSignal(this.booksService.getBooks(), { initialValue: [] });
  books = toSignal(
    this.refreshTrigger.pipe(
      startWith(null), // Para que cargue la primera vez
      switchMap(() => this.booksService.getBooks())
    ),
    { initialValue: [] }
  );

  deleteBook(id: string) {
    this.booksService.delete(id).subscribe(() => {
      this.refreshTrigger.next(); // Esto refresca el signal 'books'
    });
  };

  addBook(title: string, author: string, category: string) {
    const newBook = { title, author, category };

    this.booksService.addBook(newBook).subscribe(() => {
      this.refreshTrigger.next(); // 🔥 refresca lista
    });
  }
}
