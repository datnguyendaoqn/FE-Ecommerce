import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store'; 
import { loginSuccess, logout } from '@features/auth/store/auth.actions'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit { 
  
  constructor(private store: Store) {} 
  
  ngOnInit() {
    this.validateAndRestoreState();
  }

  private isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < (Date.now() / 1000);
    } catch {
      return true; 
    }
  };

  private validateAndRestoreState() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      
      if (this.isTokenExpired(token)) {
        console.warn("Token đã hết hạn, đang dọn dẹp localStorage.");
        localStorage.clear();
        this.store.dispatch(logout());
        return; 
      }

      try {
        const userData = JSON.parse(user);
        this.store.dispatch(
          loginSuccess({
            isLogged: true,
            fullName: userData.fullName,
            role: userData.role 
          })
        );
      } catch (e) {
        console.error("Lỗi parse user, đang dọn dẹp localStorage.", e);
        localStorage.clear();
        this.store.dispatch(logout());
      }
    } else {
      this.store.dispatch(logout());
    }
  }
}