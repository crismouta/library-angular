import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookStoreService } from '../../../../core/services/book-store-service/book-store.service';
import { UpdateBookDto } from '../../models/book.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-book-details',
  imports: [ConfirmDialog],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  readonly bookStore = inject(BookStoreService);
  private readonly router = inject(Router);

  readonly bookId = input.required<string>();
  readonly book = computed(() => this.bookStore.findBookById(this.bookId()) ?? null);

  readonly isEditing = signal(false);
  readonly isDeleteDialogOpen = signal(false);
  readonly isSaveDialogOpen = signal(false);

  constructor() {
    effect(() => {
      this.bookStore.ensureBookLoaded(this.bookId());
    });
  }

  readonly draftBook = signal<UpdateBookDto>({
    title: '',
    author: '',
    category: '',
  });

  readonly isDraftBookValid = computed(() => {
    const currentDraft = this.draftBook();

    return !!currentDraft.title.trim()
      && !!currentDraft.author.trim()
      && !!currentDraft.category.trim();
  });

  navigateToBookList(): void {
    this.router.navigate(['/books']);
  }

  startEditing(): void {
    const currentBook = this.book();
    if (!currentBook) {
      return;
    }

    this.draftBook.set({
      title: currentBook.title,
      author: currentBook.author,
      category: currentBook.category,
    });

    this.isEditing.set(true);
  }

  updateDraftField(field: keyof UpdateBookDto, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.draftBook.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  requestSaveChanges(): void {
    if (this.isDraftBookValid()) {
      this.isSaveDialogOpen.set(true);
    }
  }

  confirmSaveChanges(): void {
    const currentBook = this.book();
    if (!currentBook) {
      return;
    }

    const currentDraft = this.draftBook();

    const updatedBook: UpdateBookDto = {
      title: currentDraft.title.trim(),
      author: currentDraft.author.trim(),
      category: currentDraft.category.trim(),
    };

    this.bookStore.updateBook(currentBook.id, updatedBook);
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

    if (currentBook) {
      this.bookStore.deleteBook(currentBook.id, () => {
        this.isDeleteDialogOpen.set(false);
        this.navigateToBookList();
      });
    }
  }

  cancelDelete(): void {
    this.isDeleteDialogOpen.set(false);
  }
}
