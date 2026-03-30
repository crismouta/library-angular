import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../../../core/services/books-service';
import { BookForm } from '../../components/book-form/book-form';
import { Book, CreateBookDto } from '../../../../shared/models/book.model';

@Component({
  selector: 'app-book-details',
  imports: [BookForm],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  private readonly bookService = inject(BooksService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly bookId = computed(() => this.route.snapshot.paramMap.get('bookId') ?? '');
  readonly book = computed(() => this.bookService.getBookById(this.bookId()) ?? null);

  navigateToBookList() {
    this.router.navigate(['/books']);
  }

  onDelete(): void {
    const currentBook = this.book();
    if (!currentBook) return;

    const confirmed = window.confirm(`¿Seguro que quieres eliminar "${currentBook.title}"?`);
    if (!confirmed) return;

    this.bookService.deleteBook(currentBook.id);
    this.navigateToBookList();
  }

  onUpdateBook(formValue: CreateBookDto): void {
    const currentBook = this.book();
    if (!currentBook) return;

    const updatedBook: Book = {
      id: currentBook.id,
      ...formValue,
    };

    this.bookService.updateBook(updatedBook);
  }
}
