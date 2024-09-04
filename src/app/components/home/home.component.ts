import { Component } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { BookTable } from '../book-table/bookTable.component';


@Component({
    selector: 'app-home',
    standalone: true,
    template: `

  <app-book-table/>
  
  `,
    styles: ``,
    imports: [RouterOutlet, BookTable, MatDialogModule ]
})
export class HomeComponent {

}
