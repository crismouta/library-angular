import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  private booksService = inject(BooksService);

  books = this.booksService.getBooks();
}
