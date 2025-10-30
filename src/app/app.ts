import { Component, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';
import { Store } from '@ngrx/store';
import { loginSuccess } from '@features/auth/store/auth.actions';

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

  constructor(private store: Store) { }
  ngOnInit() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      const userData = JSON.parse(user);

      // Dispatch lại action loginSuccess để phục hồi trạng thái đăng nhập
      this.store.dispatch(
        loginSuccess({
          isLogged: true,
          fullName: userData.fullName
        })
      );
    }
  }
}