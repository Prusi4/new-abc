import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../../services/bookService.service';
import { Book } from '../../models/book';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-members',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
  ],
  template: `
    <div class="form-container">
      <form class="example-form" #form="ngForm">
        <mat-form-field class="example-full-width">
          <mat-label>Titolo</mat-label>
          <input
            matInput
            placeholder=""
            [(ngModel)]="newBook.tittle"
            name="tittle"
            type="text"
            required
          />
          <mat-error
            *ngIf="
              form.controls['tittle']?.invalid &&
              (form.controls['tittle']?.dirty ||
                form.controls['tittle']?.touched)
            "
          >
            Inserisci il titolo del libro
          </mat-error>
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <mat-label>Autore</mat-label>
          <input
            matInput
            placeholder=""
            [(ngModel)]="newBook.author"
            name="author"
            type="text"
            required
          />
          <mat-error
            *ngIf="
              form.controls['author']?.invalid &&
              (form.controls['author']?.dirty ||
                form.controls['author']?.touched)
            "
          >
            Inserisci il nome dell'autore
          </mat-error>
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <mat-label>ISBN</mat-label>
          <input
            matInput
            placeholder=""
            [(ngModel)]="newBook.isbn"
            name="isbn"
            type="text"
            minlength="13"
            maxlength="13"
            required
          />
          <mat-error
            *ngIf="
              form.controls['isbn']?.invalid &&
              (form.controls['isbn']?.dirty || form.controls['isbn']?.touched)
            "
          >
            ISBN deve essere di 13 cifre
          </mat-error>
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <mat-label>Stato</mat-label>
          <input
            matInput
            placeholder=""
            [(ngModel)]="newBook.status"
            name="status"
            type="text"
            required
          />
          <mat-error
            *ngIf="
              form.controls['status']?.invalid &&
              (form.controls['status']?.dirty ||
                form.controls['status']?.touched)
            "
          >
            Status può essere solo disponibile o in prestito
          </mat-error>
        </mat-form-field>
      </form>
    </div>

    <button
      mat-raised-button
      color="primary"
      class="custom-button"
      (click)="onSaveBook()"
    >
      Save
    </button>
  `,
  styles: `
  .custom-button {
  margin-top: 20px; 
  width: 100%; 
  font-size: 16px; 
  height: 50px; 
  background-color: pink;

  .example-full-width {
  display: block;
  margin-bottom: 15px; 
}
}

  `,
})
export class NewBookComponent implements OnInit {
  newBook: Book = {
    id: 0,
    tittle: '',
    author: '',
    isbn: '',
    status: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<NewBookComponent>,
    private bookService: BookService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSaveBook(): void {
    this.generateNextId().subscribe(
      (nextId: number) => {
        this.newBook.id = nextId;

        this.bookService.saveBook(this.newBook).subscribe(
          (savedBook: Book) => {
            console.log('new book saved successfully:', savedBook);

            this.openSnackBar('Book saved successfully');

            this.clearForm();

            this.dialogRef.close();

            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['.'], { relativeTo: this.route });
          },
          (error) => {
            console.error('Error saving new book:', error);

            this.openSnackBar('Error saving book');
          }
        );
      },
      (error) => {
        console.error('Error obtaining next ID:', error);

        this.openSnackBar('Error generating next ID');
      }
    );
}


  private generateNextId(): Observable<number> {
    return this.bookService.getBook().pipe(
      map((books: Book[]) => {
        if (books.length === 0) {
          return 1;
        }

        const maxId = books.reduce((prev, current) => {
          return current.id > prev.id ? current : prev;
        }).id;

        const nextId = +maxId + 1;
        return nextId;
      })
    );
  }

  private clearForm(): void {
    this.newBook = {
      id: 0,
      tittle: '',
      author: '',
      isbn: '',
      status: '',
    };
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
