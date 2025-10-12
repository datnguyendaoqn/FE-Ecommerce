import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>{{ title() }}</h1>
    
    <router-outlet></router-outlet>
  `,
  //templateUrl: './app.html',
  styleUrls: ['./app.scss'] // để đúng file của component, không phải styles.scss toàn cục
})
export class App {
  protected readonly title = signal('FE.Ecommerce');
}
  