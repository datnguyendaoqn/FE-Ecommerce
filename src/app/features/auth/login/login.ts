import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { loginSuccess, logout } from '@features/auth/store/auth.actions';
import { selectIsLoggedIn } from '@features/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  isLoggedIn$!: Observable<boolean>;

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(private store: Store, private logger: NGXLogger) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  /** Xử lý login */
  onLogin() {
    this.logger.debug('Click Login !!', { email: this.email });
    // Dispatch action login thành công
    this.store.dispatch(
      loginSuccess({
        isLogged: true,
      })
    );
  }

  /** Xử lý logout */
  onLogout() {
    this.logger.debug('Click Logout !!');
    this.store.dispatch(logout());
  }

  /** Toggle hiển thị mật khẩu */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
