import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Import DTO và Service
import { SellerProductService } from 'src/services/seller-product/seller-product.service';
import { SellerProductDetailDto, SellerProductVariantDetailDto } from '@dtos/product/seller-product-detail.dto';

// Import Service và DTO của Category
import { CategoryService } from 'src/services/category/category.service';
import { RecursiveCategoryDto } from '@dtos/category/category.dto';

@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    CurrencyPipe,
    ReactiveFormsModule // <-- Import ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
})
export class SellerProductFormComponent implements OnInit {
  
  productForm: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  private productId = signal<number | null>(null);

  // Signal để lưu danh mục (lấy từ API)
  categories = signal<RecursiveCategoryDto[]>([]); 

  constructor(
    private fb: FormBuilder,
    private sellerProductService: SellerProductService,
    private toastr: ToastrService,
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService // <-- Inject CategoryService
  ) {
    // Khởi tạo form rỗng ban đầu
    this.productForm = this.initForm();
  }

  ngOnInit() {
    this.loadCategories(); // Tải danh mục khi component khởi chạy
    
    // Kiểm tra URL để xem đây là trang Thêm mới hay Chỉnh sửa
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProductForEdit(id);
    } else {
      this.isEditMode.set(false);
      this.productForm = this.initForm(); // Tạo form mới
    }
  }

  /**
   * Tải danh sách danh mục từ API
   */
  async loadCategories() {
    try {
      const categoryTree = await this.categoryService.getAllCategories();
      // API trả về dạng cây, chúng ta "làm phẳng" (flatten) cây này
      const flatCategories = this.flattenCategories(categoryTree);
      this.categories.set(flatCategories);
    } catch (error) {
      this.toastr.error('Không thể tải danh mục.', 'Lỗi');
    }
  }

  /**
   * Helper (Đệ quy) để làm phẳng cây danh mục cho dropdown
   */
  private flattenCategories(
    categories: RecursiveCategoryDto[], 
    prefix = ''
  ): RecursiveCategoryDto[] {
    
    let flatList: RecursiveCategoryDto[] = [];
    
    for (const category of categories) {
      const categoryName = `${prefix}${category.name}`;
      flatList.push({ ...category, name: categoryName });

      if (category.children && category.children.length > 0) {
        const childPrefix = `${categoryName} > `;
        flatList = flatList.concat(
          this.flattenCategories(category.children, childPrefix)
        );
      }
    }
    return flatList;
  }

  /**
   * Khởi tạo form (cho cả Thêm mới và Chỉnh sửa)
   */
  initForm(product: SellerProductDetailDto | null = null): FormGroup {
    const form = this.fb.group({
      // 1. Thông tin cơ bản
      name: [product?.name || '', [Validators.required, Validators.maxLength(200)]],
      description: [product?.description || ''],
      brand: [product?.brand || ''],
      categoryId: [product?.categoryId || null, [Validators.required]],
      
      // 3. Phân loại hàng (Variants)
      variants: this.fb.array(
        this.isEditMode() && product 
          ? [] // Ở chế độ Sửa, không dùng FormArray
          : [this.createVariantGroup()] // Ở chế độ Mới, tạo 1 nhóm rỗng
      )
    });

    if (this.isEditMode()) {
      // Nếu là chế độ Sửa, khóa (disable) phần variants
      form.get('variants')?.disable();
    }
    
    return form;
  }

  /**
   * Tải dữ liệu sản phẩm khi ở chế độ Sửa
   */
  async loadProductForEdit(id: number) {
    this.isLoading.set(true);
    try {
      const product = await this.sellerProductService.getProductDetail(id);
      this.productForm = this.initForm(product); // Tạo form với dữ liệu
      
      // (Lưu riêng data variant để hiển thị read-only)
      this.productForm.addControl('variants_readonly', this.fb.control(product.variants));

    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải sản phẩm');
      this.router.navigate(['/seller/products']);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Tạo một FormGroup cho một biến thể (variant)
   */
  createVariantGroup(): FormGroup {
    return this.fb.group({
      sku: ['', [Validators.required]],
      variantSize: [''],
      color: [''],
      price: [1000, [Validators.required, Validators.min(1000)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      image: [null, [Validators.required]] // Sẽ lưu File object
    });
  }

  // Getter tiện lợi để lấy FormArray
  get variantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }
  
  // Getter tiện lợi để lấy danh sách variants (chế độ Sửa)
  get variantsReadOnly(): SellerProductVariantDetailDto[] {
    return this.productForm.get('variants_readonly')?.value || [];
  }

  addVariant() {
    this.variantsArray.push(this.createVariantGroup());
  }

  removeVariant(index: number) {
    if (this.variantsArray.length > 1) {
      this.variantsArray.removeAt(index);
    } else {
      this.toastr.warning('Sản phẩm phải có ít nhất 1 phân loại hàng.');
    }
  }

  /**
   * Xử lý khi người dùng chọn file ảnh cho variant
   */
  onFileChange(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const variantGroup = this.variantsArray.at(variantIndex);
      variantGroup.patchValue({ image: file });
      variantGroup.get('image')?.updateValueAndValidity();
    }
  }

  /**
   * Xử lý khi submit form
   */
  async onSubmit() {
    if (this.productForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      this.productForm.markAllAsTouched(); // Hiển thị lỗi
      return;
    }

    this.isLoading.set(true);

    try {
      if (this.isEditMode()) {
        // ========== CHẾ ĐỘ CẬP NHẬT (PUT) ==========
        const dto = {
          name: this.productForm.value.name,
          description: this.productForm.value.description,
          brand: this.productForm.value.brand,
          categoryId: this.productForm.value.categoryId,
        };
        
        await this.sellerProductService.updateProduct(this.productId()!, dto);
        this.toastr.success('Cập nhật sản phẩm thành công!');
        
      } else {
        // ========== CHẾ ĐỘ TẠO MỚI (POST) ==========
        const formData = this.buildFormData();
        await this.sellerProductService.createProduct(formData);

        this.toastr.success('Tạo sản phẩm thành công!');
        this.router.navigate(['/seller/products']); // Điều hướng về danh sách
      }
    } catch (error) {
      this.toastr.error(String(error), 'Đã xảy ra lỗi');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Xây dựng FormData để gửi API (cho chế độ Thêm mới)
   */
  private buildFormData(): FormData {
    const formData = new FormData();
    const formValue = this.productForm.value;

    // 1. Thêm thông tin cơ bản
    formData.append('name', formValue.name);
    formData.append('description', formValue.description || '');
    formData.append('brand', formValue.brand || '');
    formData.append('categoryId', formValue.categoryId.toString());
    
    // 2. Thêm thông tin variants (dạng mảng)
    this.variantsArray.controls.forEach((variantControl, index) => {
      const variant = (variantControl as FormGroup).value;
      
      formData.append(`Variants[${index}].SKU`, variant.sku);
      formData.append(`Variants[${index}].VariantSize`, variant.variantSize || '');
      formData.append(`Variants[${index}].Color`, variant.color || '');
      formData.append(`Variants[${index}].Price`, variant.price.toString());
      formData.append(`Variants[${index}].Quantity`, variant.quantity.toString());
      
      // Thêm file ảnh của variant
      if (variant.image instanceof File) {
        formData.append(`Variants[${index}].Image`, variant.image, variant.image.name);
      }
    });

    return formData;
  }

  /** * Helper để check lỗi form (ĐÃ SỬA)
   * Chấp nhận AbstractControl thay vì chỉ FormGroup
   */
  isInvalid(controlName: string, formGroup: AbstractControl | null = null): boolean {
    const form = formGroup || this.productForm;
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** * Hàm xử lý nút Hủy (ĐÃ THÊM)
   */
  onCancel() {
    this.router.navigate(['/seller/products']);
  }
}
