import { Component, computed, inject, input} from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books-service';

@Component({
  selector: 'app-book-details',
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  private bookService = inject(BooksService);
  private router = inject(Router)

  // El nombre del input debe coincidir con el nombre en la ruta (':id')
  bookId = input.required<string>(); 

  // Reacciona automáticamente cuando el ID cambia en la URL
  book = computed(() => this.bookService.getById(this.bookId()));
  
  navigateToBookList() {
    this.router.navigate(['/books']);
  }
}
