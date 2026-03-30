import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BookStoreService } from '../../../../core/services/book-store-service/book-store.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Router } from '@angular/router';
import { BookItem } from '../../components/book-item/book-item';

@Component({
  selector: 'app-book-list',
  imports: [BookItem, ConfirmDialog],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  readonly bookStore = inject(BookStoreService);
  private readonly router = inject(Router);

  readonly pendingDeleteBookId = signal<string | null>(null);
  readonly isBulkDeleteDialogOpen = signal(false);

  navigateToCreateBook(): void {
    this.router.navigate(['/books/create']);
  }

  requestDeleteBook(bookId: string): void {
    this.pendingDeleteBookId.set(bookId);
  }

  confirmDeleteBook(): void {
    const bookId = this.pendingDeleteBookId();
    if (!bookId) {
      return;
    }

    this.bookStore.deleteBook(bookId);
    this.pendingDeleteBookId.set(null);
  }

  cancelDeleteBook(): void {
    this.pendingDeleteBookId.set(null);
  }

  onSelectionToggle(bookId: string): void {
    this.bookStore.toggleBookSelection(bookId);
  }

  openBulkDeleteDialog(): void {
    this.isBulkDeleteDialogOpen.set(true);
  }

  confirmBulkDelete(): void {
    this.bookStore.deleteSelectedBooks();
    this.isBulkDeleteDialogOpen.set(false);
  }

  cancelBulkDelete(): void {
    this.isBulkDeleteDialogOpen.set(false);
  }
}
