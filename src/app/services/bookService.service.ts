import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  private booksSubject = new BehaviorSubject<Book[]>([]);

  getBooksSubject(): BehaviorSubject<Book[]> {
    return this.booksSubject;
  }

  constructor(private http: HttpClient) {}

  getBook(): Observable<any> {
    return this.http.get(this.apiUrl, { responseType: 'json' });
  }

  deleteBook(id: number): Observable<string> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    return throwError(errorMessage);
  }

  saveBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateStatus(id: number, newStatus: string): Observable<Book> {
    const patchUrl = `${this.apiUrl}/${id}/status`; 
    const statusUpdate = { status: newStatus };

    return this.http.patch<Book>(patchUrl, statusUpdate);
  }
}
