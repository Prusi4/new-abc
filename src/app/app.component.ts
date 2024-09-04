import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <app-navbar/>
    <div class="main-container">
    <router-outlet />
    </div>
    
  `,
    styles: `
     .main-container{
      padding: 2rem;
     }

    `,

    imports: [RouterOutlet, NavbarComponent]
})
export class AppComponent {

}
