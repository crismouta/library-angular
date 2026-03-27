import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { BookList } from './components/book-list/book-list';
import { BookDetails } from './components/book-details/book-details';
import { NotFound } from './components/not-found/not-found';
import { Layout } from './components/layout/layout';

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
