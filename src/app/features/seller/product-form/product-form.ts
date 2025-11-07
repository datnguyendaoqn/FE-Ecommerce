// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormArray,
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { MatIcon } from '@angular/material/icon';
// import { Observable } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
// import { ProductService } from 'src/services/product/product.service';
// import { CategoryDto } from '@dtos/category/category';
// import { ProductSummaryDto } from '@dtos/product/product';

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIcon],
//   templateUrl: './product-form.component.html',
// })
// export class ProductFormComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   private productService = inject(ProductService);
//   private toast = inject(ToastrService);

//   productForm!: FormGroup;
//   isEditMode = false;
//   productId: number | null = null;
//   categories$!: Observable<CategoryDto[]>;
//   isLoading = false;

//   constructor() {
//     this.productForm = this.fb.group({
//       id: [null],
//       name: ['', Validators.required],
//       description: [''],
//       brand: ['', Validators.required],
//       categoryId: [null, Validators.required],
//       status: ['active', Validators.required],

//       variants: this.fb.array([], Validators.required),

//       media: this.fb.array([]),
//     });
//   }

//   ngOnInit() {
//     this.categories$ = this.productService.getAll();
    
//     this.route.paramMap.subscribe((params) => {
//       const id = params.get('id');
//       if (id) {
//         this.isEditMode = true;
//         this.productId = +id;
//         this.loadProductData(+id);
//       } else {

//         this.addVariant();
//       }
//     });
//   }

//   loadProductData(id: number) {
//     this.productService.getById(id).subscribe((product) => {
//       if (product) {
//         this.productForm.patchValue(product);
        
//         this.variants.clear();

//         product.variants.forEach(variant => {
//           this.variants.push(this.fb.group(variant));
//         });
        
//       } else {
//         this.toast.error('Không tìm thấy sản phẩm');
//         this.router.navigate(['/seller/products']);
//       }
//     });
//   }

//   get variants() {
//     return this.productForm.get('variants') as FormArray;
//   }

//   createVariantGroup(): FormGroup {
//     return this.fb.group({
//       id: [null],
//       sku: ['', Validators.required],
//       variantSize: ['', Validators.required],
//       color: ['', Validators.required],
//       price: [0, [Validators.required, Validators.min(1000)]],
//       quantity: [0, [Validators.required, Validators.min(0)]],
//     });
//   }

//   addVariant() {
//     this.variants.push(this.createVariantGroup());
//   }

//   removeVariant(index: number) {
//     if (this.variants.length > 1) {
//       this.variants.removeAt(index);
//     } else {
//       this.toast.warning('Phải có ít nhất 1 biến thể');
//     }
//   }

//   addMockMedia() {

//      const mediaFormArray = this.productForm.get('media') as FormArray;
//      mediaFormArray.push(this.fb.group({
//        id: [null],
//        imageUrl: ['https://via.placeholder.com/600x600.png?text=New+Image+' + Date.now()],
//        isPrimary: [mediaFormArray.length === 0], 
//        altText: ['Mô tả ảnh'],
//      }))
//   }

//   onSubmit() {
//     if (this.productForm.invalid) {
//       this.toast.error('Vui lòng kiểm tra lại form, có trường bị lỗi');
//       this.productForm.markAllAsTouched();
//       return;
//     }
    
//     this.isLoading = true;
//     const productData = this.productForm.value as ProductSummaryDto;
    
//     if (!productData.media || productData.media.length === 0) {
//       this.addMockMedia();
//     }

//     this.productService.saveProduct(productData).subscribe({
//       next: (savedProduct) => {
//         this.isLoading = false;
//         this.toast.success(`Đã ${this.isEditMode ? 'cập nhật' : 'tạo mới'} sản phẩm!`);
//         this.router.navigate(['/seller/products']);
//       },
//       error: (err) => {
//         this.isLoading = false;
//         this.toast.error('Lưu thất bại: ' + err.message);
//       }
//     });
//   }
// }