import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Book } from '../../models/book';
import { BookService } from '../../services/bookService.service';
import { DeleteDialogComponent } from '../delete-dialog.ts/deleteDialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    HttpClientModule,
  ],
  template: `
    <mat-form-field>
      <mat-label>Filter</mat-label>
      <input
        matInput
        (keyup)="applyFilter($event)"
        placeholder="Search here"
        #input
      />
    </mat-form-field>

    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
          <td mat-cell *matCellDef="let row">{{ row.id }}</td>
        </ng-container>

        <ng-container matColumnDef="tittle">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Titolo</th>
          <td mat-cell *matCellDef="let row">{{ row.tittle }}</td>
        </ng-container>

        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Autore</th>
          <td mat-cell *matCellDef="let row">{{ row.author }}</td>
        </ng-container>

        <ng-container matColumnDef="ISBN">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ISBN</th>
          <td mat-cell *matCellDef="let row">{{ row.isbn }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Stato</th>
          <td mat-cell *matCellDef="let row">{{ row.status }}</td>
        </ng-container>

        <ng-container matColumnDef="changeStatus">
          <th mat-header-cell *matHeaderCellDef>Change Status</th>
          <td mat-cell *matCellDef="let row">
            <button
              mat-raised-button
              color="primary"
              class="custom-button"
              (click)="changeStatus(row)"
            >
              Change Status
            </button>
          </td>
        </ng-container>

        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Eliminare</th>
          <td mat-cell *matCellDef="let row">
            <button
              mat-raised-button
              color="warn"
              class="delete-button"
              (click)="deleteBook(row)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="4">
            No data matching the filter "{{ input.value }}"
          </td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[10, 25, 100]"
        aria-label="Select page of users"
      ></mat-paginator>
    </div>
  `,
  styles: `

  table {
  width: 100%;
}

.delete-button {
  color: white; 
  background-color: transparent; 
  padding: 0; 
  border: none; 
}

.delete-button {
  background-color: #f44336; 
  color: white; 
  padding: 8px 16px; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  transition: background-color 0.3s; 
}

.delete-button:hover {
  background-color: #d32f2f; 
}


.mat-row{
  color: white;
  font-size: 20px; 
  padding: 12px 24px;
}

.custom-button {
  background-color: #4CAF50; 
  color: white; 
  padding: 10px 20px; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  transition: background-color 0.3s; 
}

.custom-button:hover {
  background-color: #45a049; 
}



  `,
})
export class BookTable implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'tittle',
    'author',
    'ISBN',
    'status',
    'changeStatus',
    'delete',
  ];
  dataSource: MatTableDataSource<Book>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<Book>();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getBookData();
  }

  getBookData() {
    this.bookService.getBook().subscribe((book) => {
      this.dataSource.data = book;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteBook(row: Book): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { bookTitle: row.tittle },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.bookService.deleteBook(row.id).subscribe(
          (message) => {
            console.log('Delete response:', message);
            this.dataSource.data = this.dataSource.data.filter(
              (book) => book.id !== row.id
            );

            // Refresh the page after deleting the book
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['.'], { relativeTo: this.route });
          },
          (error) => {
            console.error('Error deleting book:', error);
            alert('Error deleting book: ' + error);
          }
        );
      }
    });
  }

  changeStatus(row: Book): void {
    const newStatus =
      row.status === 'disponibile' ? 'in prestito' : 'disponibile';

    this.bookService.updateStatus(row.id, newStatus).subscribe(
      (updatedBook) => {
        row.status = updatedBook.status;
        this.dataSource.data = this.dataSource.data.map((book) => {
          if (book.id === row.id) {
            return row;
          }
          return book;
        });
      },
      (error) => {
        console.error('Error updating book status:', error);
      }
    );
  }
}
