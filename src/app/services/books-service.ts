import { Injectable } from '@angular/core';
import { Book } from '../intefaces/book';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  books: Book[] = [
    {
      id: '1',
      title: 'Title 1',
      author: 'Author 1',
      category: 'Category 1'
    },
    {
      id: '2',
      title: 'Title 2',
      author: 'Author 2',
      category: 'Category 2'
    },
    {
      id: '3',
      title: 'Title 3',
      author: 'Author 3',
      category: 'Category 3'
    },
  ];

  getBooks():Book[] {
    return this.books;
  }

  getById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}
