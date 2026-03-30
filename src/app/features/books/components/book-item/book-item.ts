import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

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

  readonly deleteRequested = output<void>();
  readonly selectionToggled = output<void>();

  onDeleteClick(): void {
    this.deleteRequested.emit();
  }

  onSelectionChange(): void {
    this.selectionToggled.emit();
  }
}
