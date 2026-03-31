# Book App (Angular 21 + JSON Server)

A simple CRUD application built with **Angular 21** using **standalone components**, **signals**, **modern template control flow** (`@if`, `@for`, `@let`), and a small in-memory backend powered by **json-server**.

This project is designed as a learning example to demonstrate:

- Angular 21 modern project structure
- API service vs Store service separation
- Signals for local state management
- Reactive Forms
- Routing with `withComponentInputBinding()`
- Reusable presentational components
- Clean CRUD flow (list, details, create, update, delete)

---

## Tech stack

- Angular 21
- TypeScript
- RxJS
- Reactive Forms
- JSON Server (fake REST API)

---

## Features

- View all books
- View book details
- Create a new book
- Edit a book inline
- Delete a single book
- Bulk delete selected books
- Confirmation dialog before destructive actions

---

## Project architecture

This project follows a simple and clean separation of responsibilities:

### `BookApiService`

Responsible only for HTTP communication with the backend.

### `BookStoreService`

Responsible for UI state and business flow:

- books list
- loading state
- error state
- selected books
- local state updates after API responses

### Feature components

- `BookList`
- `BookDetails`
- `BookCreate`
- `BookForm`
- `BookItem`

### Shared components

- `ConfirmDialog`

---

## Run the project

This project requires **two terminals** running at the same time:

### 1. Start the fake backend with JSON Server

```bash
json-server --watch db.json --port 3000
```

The API will be available at:

```bash
http://localhost:3000/books
```

### 2. Start the Angular application

```bash
ng serve
```

Then open:

```bash
http://localhost:4200
```
---

## Notes

This project is intended as a learning CRUD example for practicing modern Angular 21 patterns without using NgRx, while still keeping a clear store-like architecture.
