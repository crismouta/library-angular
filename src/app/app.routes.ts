import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { BookList } from './features/books/pages/book-list/book-list';
import { BookDetails } from './features/books/pages/book-details/book-details';
import { NotFound } from './pages/not-found/not-found';
import { Layout } from './layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
            { path: 'books', component: BookList }, 
            { path: 'books/:bookId', component: BookDetails },
            { path: '**', component: NotFound } 
        ]
    },
];
