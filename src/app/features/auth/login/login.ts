import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { loginSuccess, logout } from '@features/auth/store/auth.actions';
import { selectIsLoggedIn } from '@features/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoggerService } from 'src/configs/logger.service';

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

  constructor(
    private store: Store,
    private logger: LoggerService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  /** Xử lý login */
  async onLogin() {
    try {
      const loginRes = await this.authService.login({ email: this.email, password: this.password })
      if (loginRes.isSuccess) {
        this.logger.debug("Tên user: ", loginRes.data.fullName)
        this.store.dispatch(
          loginSuccess({
            isLogged: Boolean(loginRes.isSuccess),
            fullName: loginRes.data.fullName
          })
        );

        // Lưu accessToken 
        localStorage.setItem("token", loginRes.data.accessToken)
        localStorage.setItem("user", JSON.stringify({ fullName: loginRes.data.fullName, role: loginRes.data.role, id: loginRes.data.id })),
          this.toast.success("Đăng nhập thành công", "Thành công")
          this.router.navigate(["/home"])
      }
    } catch (error) {
      this.toast.error(String(error), "Lỗi")
    }
  }

  /** Xử lý logout */
  onLogout() {
    this.store.dispatch(logout());
    localStorage.clear()
  }

  /** Toggle hiển thị mật khẩu */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
