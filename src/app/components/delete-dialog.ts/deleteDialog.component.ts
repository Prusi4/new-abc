import { Component, Inject } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatRadioModule, FormsModule],
  template: `
    <p class="ti">Are you sure you want to delete {{ data.bookAuthor }}?</p>
    <mat-radio-group aria-label="Select an option" [(ngModel)]="selectedOption">
      <mat-radio-button [value]="true">Yes</mat-radio-button>
      <mat-radio-button [value]="false">No</mat-radio-button>
    </mat-radio-group>
    <button mat-raised-button color="primary" class="custom-button" (click)="onConfirm()">Confirm</button>

  `,
  styles: [
    `
      .ti {
        font-size: large;
        color: white;
      }
      .custom-button {
  background-color: pink; 
  font-size: 16px; 
  padding: 12px 24px; 
}

    `,
  ],
})
export class DeleteDialogComponent {
  selectedOption: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookAuthor: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(this.selectedOption);
  }
}
