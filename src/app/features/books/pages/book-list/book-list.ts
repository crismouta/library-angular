import { Component, inject, signal } from '@angular/core';
import { BooksService } from '../../../../core/services/book-store-service/books-store.service';
import { BookForm } from '../../components/book-form/book-form';
import { BookItem } from '../../components/book-item/book-item';
import { CreateBookDto } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  imports: [BookForm, BookItem],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  private bookService = inject(BooksService);

  readonly books = this.bookService.books;
  readonly isLoading = this.bookService.isLoading;
  readonly error = this.bookService.error;
  readonly selectedBookIds = this.bookService.selectedBookIds;
  readonly selectedCount = this.bookService.selectedCount;

  onAddBook(book: CreateBookDto): void {
    this.bookService.addBook(book);
  }

  onDeleteBook(id: string): void {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este libro?');
    if (!confirmed) return;

    this.bookService.deleteBook(id);
  }

  onToggleSelection(id: string): void {
    this.bookService.toggleBookSelection(id);
  }

  onDeleteSelected(): void {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar ${this.selectedCount()} libro(s) seleccionado(s)?`
    );

    if (!confirmed) return;

    this.bookService.deleteSelectedBooks();
  }
}
