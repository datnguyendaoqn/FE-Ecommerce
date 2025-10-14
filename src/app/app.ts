import { Component, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
})
export class MainLayoutComponent {
  protected readonly title = signal('Ecommerce');

  constructor(private logger: NGXLogger) { }
}