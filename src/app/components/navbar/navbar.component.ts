import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewBookComponent } from '../new-book/newBook.component';
import { AvailabeBookComponent } from '../available-book/availableBook.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule, MatTooltip],
  template: `
    <p>
      <mat-toolbar color="primary">
        <span>Library</span>
        <span class="example-spacer"></span>
        <button
          (click)="openDialog('500ms', '500ms')"
          mat-icon-button
          class="example-icon book-icon"
          aria-label="Example icon-button with book icon"
          matTooltip="Libri disponibili"
        >
          <mat-icon>book</mat-icon>
        </button>

        <button
          (click)="openDialogNew('500ms', '500ms')"
          mat-icon-button
          class="example-icon bookmark-icon"
          aria-label="Example icon-button with bookmark icon"
          matTooltip="Aggiungere Libro"
          
        >
          <mat-icon>add new</mat-icon>
        </button>
      </mat-toolbar>
    </p>
  `,
  styles: ``,
})
export class NavbarComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AvailabeBookComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openDialogNew(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(NewBookComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed');
    });
  }
}
