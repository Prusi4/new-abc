import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { Book } from '../../models/book';
import { BookService } from '../../services/bookService.service';
import { DeleteDialogComponent } from '../delete-dialog.ts/deleteDialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
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
  ],
  selector: 'app-favailable-book',
  template: `
    <h2 class="white-text">Availabe Book</h2>

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
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Tittle</th>
          <td mat-cell *matCellDef="let row">{{ row.tittle }}</td>
        </ng-container>

        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Author</th>
          <td mat-cell *matCellDef="let row">{{ row.author }}</td>
        </ng-container>

        <ng-container matColumnDef="ISBN">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ISBN</th>
          <td mat-cell *matCellDef="let row">{{ row.isbn }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
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
          <td class="mat-cell" colspan="7">
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

.delete-button mat-icon {
  font-size: 30px; 
}

.delete-button:hover {
  background-color: transparent; 
}

.mat-row{
  color: white;
  font-size: 20px; 
  padding: 12px 24px;
}

.white-text {
  color: white;
}


  `,
})
export class AvailabeBookComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'tittle', 'author', 'ISBN', 'actions'];
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
    this.getMembersData();
  }

  getMembersData() {
    this.bookService.getBook().subscribe((book: Book[]) => {
      const availableBook = book.filter(
        (book: Book) => book.status === 'disponibile'
      );
      this.dataSource.data = availableBook;
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

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.bookService.deleteBook(row.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(
            (book) => book.id !== row.id
          );
        });
      }
    });
  }
}
