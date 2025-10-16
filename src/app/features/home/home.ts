import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
})
export class HomeComponent {

  constructor(private toast: ToastrService) { }
  onClickSuccess() {
    this.toast.success("Thanhf cong")
  }
}
