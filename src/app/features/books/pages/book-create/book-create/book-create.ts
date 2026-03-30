import { Component, inject } from '@angular/core';
import { BookForm } from '../../../components/book-form/book-form';
import { BookStoreService } from '../../../../../core/services/book-store-service/book-store.service';
import { Router } from '@angular/router';
import { CreateBookDto } from '../../../models/book.model';

@Component({
  selector: 'app-book-create',
  imports: [BookForm],
  templateUrl: './book-create.html',
  styleUrl: './book-create.css',
})
export class BookCreate {
  private readonly router = inject(Router);
  readonly bookStore = inject(BookStoreService);


  onCreateBook(book: CreateBookDto): void {
    this.bookStore.addBook(book);
    this.router.navigate(['/books']);
  }

  navigateToBookList(): void {
    this.router.navigate(['/books']);
  }
}
