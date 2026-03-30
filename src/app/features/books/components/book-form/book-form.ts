import { Component, effect, inject, model, output, ChangeDetectionStrategy, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book, CreateBookDto } from '../../models/book.model';

type BookFormValue = CreateBookDto;

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookForm {
  readonly initialValue = input<Partial<Book> | null>(null);
  readonly submitLabel = input('Add book');
  readonly formSubmit = output<BookFormValue>();
  private readonly formBuilder = inject(NonNullableFormBuilder);
  book = model<Book | null>(null);
  save = output<Omit<Book, 'id'>>();

  readonly form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    author: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (!value) {
        this.form.reset({
          title: '',
          author: '',
          category: '',
        });
        return;
      }
      this.form.patchValue({
        title: value.title ?? '',
        author: value.author ?? '',
        category: value.category ?? '',
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }
}
