import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, Subject, switchMap, startWith, combineLatest } from 'rxjs';

@Component({
  selector: 'app-book-details',
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  private bookService = inject(BooksService);
  private router = inject(Router);
  private refreshTrigger = new Subject<void>();

  // El nombre del input debe coincidir con el nombre en la ruta (':id')
  bookId = input.required<string>();

  // Reacciona automáticamente cuando el ID cambia en la URL
  //book = computed(() => this.bookService.getById(this.bookId()));
  /*  book = toSignal(
     toObservable(this.bookId).pipe(
       switchMap(id => this.bookService.getById(id).pipe(
         catchError(() => of(null)) // Si hay error (404), devolvemos null para mostrar el @else
       ))
     )
   ); */

  book = toSignal(
    combineLatest([
      toObservable(this.bookId),
      this.refreshTrigger.pipe(startWith(null))
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
        this.navigateToBookList(); // Volvemos a la lista, que se cargará fresca
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
      this.refreshTrigger.next();
      console.log('Libro actualizado');
    });
  }
}
