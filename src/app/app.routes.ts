import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AvailabeBookComponent } from './components/available-book/availableBook.component';



export const routes: Routes = [
    { path: "", component: HomeComponent},
    { path: "available book", component: AvailabeBookComponent}
];
