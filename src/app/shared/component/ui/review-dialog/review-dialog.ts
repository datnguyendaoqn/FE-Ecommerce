import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewRequestDto } from '@dtos/review/review.request.dto';
import { ToastrService } from 'ngx-toastr';

export interface ReviewDialogData {
  orderItemId: number;
  productName: string;
  productImageUrl: string;
}

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './review-dialog.html',
})
export class ReviewDialogComponent {
  
  reviewForm: FormGroup;
  currentRating = signal(0);
  hoverRating = signal(0);
 
  stars = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      commentText: ['']
    });
  }

  setRating(star: number): void {
    this.currentRating.set(star);
    this.reviewForm.get('rating')?.setValue(star);
  }

  setHoverRating(star: number): void {
    this.hoverRating.set(star);
  }

  clearHoverRating(): void {
    this.hoverRating.set(0);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (this.reviewForm.invalid) {
      this.toastr.warning('Vui lòng chọn số sao đánh giá (tối thiểu 1 sao).', 'Thông báo');
      return;
    }

    const formData = this.reviewForm.value;

    const request: ReviewRequestDto = {
      orderItemId: this.data.orderItemId,
      rating: formData.rating,
      commentText: formData.commentText
    };

    try {

      console.log('ĐANG GIẢ LẬP GỬI ĐÁNH GIÁ:', request);
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.toastr.success('Cảm ơn bạn đã đánh giá sản phẩm!', 'Thành công');
      this.dialogRef.close(true);
    } catch (error) {
      this.toastr.error(String(error), 'Lỗi');
    }
  }
}