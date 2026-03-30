import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookStoreService } from '../../../../core/services/book-store-service/book-store.service';
import { Book, CreateBookDto } from '../../models/book.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-book-details',
  imports: [ConfirmDialog],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  readonly bookStore = inject(BookStoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly bookId = computed(() => this.route.snapshot.paramMap.get('bookId') ?? '');
  readonly book = computed(() => this.bookStore.getBookById(this.bookId()) ?? null);

  readonly isEditing = signal(false);
  readonly isDeleteDialogOpen = signal(false);
  readonly isSaveDialogOpen = signal(false);

  readonly draftTitle = signal('');
  readonly draftAuthor = signal('');
  readonly draftCategory = signal('');

  navigateToBookList(): void {
    this.router.navigate(['/books']);
  }

  startEditing(): void {
    const currentBook = this.book();
    if (!currentBook) {
      return;
    }

    this.draftTitle.set(currentBook.title);
    this.draftAuthor.set(currentBook.author);
    this.draftCategory.set(currentBook.category);
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  updateDraftTitle(value: string): void {
    this.draftTitle.set(value);
  }

  updateDraftAuthor(value: string): void {
    this.draftAuthor.set(value);
  }

  updateDraftCategory(value: string): void {
    this.draftCategory.set(value);
  }

  requestSaveChanges(): void {
    const title = this.draftTitle().trim();
    const author = this.draftAuthor().trim();
    const category = this.draftCategory().trim();

    if (!title || !author || !category) {
      return;
    }

    this.isSaveDialogOpen.set(true);
  }

  confirmSaveChanges(): void {
    const currentBook = this.book();
    if (!currentBook) {
      return;
    }

    const updatedBook: Book = {
      id: currentBook.id,
      title: this.draftTitle().trim(),
      author: this.draftAuthor().trim(),
      category: this.draftCategory().trim(),
    };

    this.bookStore.updateBook(updatedBook);
    this.isSaveDialogOpen.set(false);
    this.isEditing.set(false);
  }

  cancelSaveChanges(): void {
    this.isSaveDialogOpen.set(false);
  }

  requestDelete(): void {
    this.isDeleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const currentBook = this.book();
    if (!currentBook) {
      return;
    }

    this.bookStore.deleteBook(currentBook.id);
    this.isDeleteDialogOpen.set(false);
    this.navigateToBookList();
  }

  cancelDelete(): void {
    this.isDeleteDialogOpen.set(false);
  }
}
