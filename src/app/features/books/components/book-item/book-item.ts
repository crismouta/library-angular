import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Book } from '../../../../shared/models/book.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-item',
  imports: [RouterLink],
  templateUrl: './book-item.html',
  styleUrl: './book-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookItem {
  readonly book = input.required<Book>();
  readonly isSelected = input(false);

  readonly deleteBook = output<string>();
  readonly toggleSelection = output<string>();

  onDeleteClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteBook.emit(this.book().id);
  }

  onToggleSelection(): void {
    this.toggleSelection.emit(this.book().id);
  }
}
