import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SellerProductService } from 'src/services/seller-product/seller-product.service';
import { SellerProductDetailDto, SellerProductVariantDetailDto } from '@dtos/product/seller-product-detail.dto';

import { CategoryService } from 'src/services/category/category.service';
import { RecursiveCategoryDto } from '@dtos/category/category.dto';
import { UpdateProductRequestDto } from '@dtos/product/update-product.request.dto';
import { NgxCurrencyInputMode, NgxCurrencyDirective, NgxCurrencyConfig } from "ngx-currency";


@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    CurrencyPipe,
    ReactiveFormsModule,
    NgxCurrencyDirective
  ],
  templateUrl: './product-form.html',
})
export class SellerProductFormComponent implements OnInit {
  currencyOptions = {
    prefix: "",
    suffix: " VNĐ",
    thousands: '.',
    align: 'left',
    precision: 0,
    allowNegative: false,
    inputMode: NgxCurrencyInputMode.Financial,
  };

  productForm: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  private productId = signal<number | null>(null);

  categories = signal<RecursiveCategoryDto[]>([]);

  sizeOptions = [
    "XS", "S", "M", "L", "XL", "XXL", "XXXL",
    "Free Size", "One Size", "M/L", "L/XL",
    "28", "29", "30", "31", "32", "33", "34", "35",
    "36", "37", "38", "39", "40"
  ];
  colorOptions = [
    "Đen", "Trắng", "Đỏ", "Xanh dương", "Xanh lá",
    "Vàng", "Hồng", "Tím", "Nâu", "Be",
    "Xám", "Cam", "Bạc", "Kem", "Rêu",
    "Xanh navy", "Xanh pastel", "Xanh ngọc",
    "Xanh mint", "Ghi", "Xanh than"
  ];

  productImageFiles = signal<File[]>([]);
  allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor(
    private fb: FormBuilder,
    private sellerProductService: SellerProductService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.productForm = this.initForm();
  }

  ngOnInit() {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProductForEdit(id);
    } else {
      this.isEditMode.set(false);
      this.productForm = this.initForm();
    }
  }

  async loadCategories() {
    try {
      const categoryTree = await this.categoryService.getAllCategories();
      const flatCategories = this.flattenCategories(categoryTree);
      this.categories.set(flatCategories);
    } catch (error) {
      this.toastr.error('Không thể tải danh mục.', 'Lỗi');
    }
  }

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

  initForm(product: SellerProductDetailDto | null = null): FormGroup {
    const form = this.fb.group({
      name: [product?.name || '', [Validators.required, Validators.maxLength(200)]],
      description: [product?.description || ''],
      brand: [product?.brand || ''],
      categoryId: [product?.categoryId || null, [Validators.required]],
      productImages: [null, this.isEditMode() ? null : Validators.required],
      variants: this.fb.array(
        this.isEditMode() && product
          ? []
          : [this.createVariantGroup()]
      )
    });

    if (this.isEditMode()) {
      form.get('variants')?.disable();
      form.get('productImages')?.disable();
    }

    return form;
  }

  async loadProductForEdit(id: number) {
    this.isLoading.set(true);
    try {
      const product = await this.sellerProductService.getProductDetail(id);
      this.productForm = this.initForm(product);
      this.productForm.addControl('variants_readonly', this.fb.control(product.variants));

    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải sản phẩm');
      this.router.navigate(['/seller/products']);
    } finally {
      this.isLoading.set(false);
    }
  }

  createVariantGroup(): FormGroup {
    return this.fb.group({
      sku: ['', [Validators.required]],
      variantSize: [null],
      color: [null],
      material: [null, [Validators.required]],
      price: [1000, [Validators.required, Validators.min(1000)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      image: [null, [Validators.required]]
    });
  }

  get variantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

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

  private validateFiles(files: FileList): File[] {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.allowedImageTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        this.toastr.error(`File '${file.name}' có định dạng không hợp lệ. Chỉ chấp nhận JPG, PNG, JPEG.`);
      }
    }
    return validFiles;
  }

  onProductFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const validFiles = this.validateFiles(input.files);
      this.productImageFiles.set(validFiles);
      this.productForm.patchValue({ productImages: validFiles.length > 0 ? validFiles : null });
      this.productForm.get('productImages')?.updateValueAndValidity();
      if (validFiles.length === 0) input.value = '';
    }
  }

  onVariantFileChange(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const validFiles = this.validateFiles(input.files);
      const variantGroup = this.variantsArray.at(variantIndex);
      if (validFiles.length > 0) {
        const file = validFiles[0];
        variantGroup.patchValue({ image: file });
        variantGroup.get('image')?.updateValueAndValidity();
      } else {
        variantGroup.patchValue({ image: null });
        variantGroup.get('image')?.updateValueAndValidity();
        input.value = '';
      }
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      if (this.isEditMode()) {
        const dto: UpdateProductRequestDto = {
          name: this.productForm.value.name,
          description: this.productForm.value.description,
          brand: this.productForm.value.brand,
          categoryId: this.productForm.value.categoryId,
        };

        await this.sellerProductService.updateProduct(this.productId()!, dto);
        this.toastr.success('Cập nhật sản phẩm thành công!');
        this.router.navigate(['/seller/products']);

      } else {
        const formData = this.buildFormData(this.productForm.value);
        await this.sellerProductService.createProduct(formData);

        this.toastr.success('Tạo sản phẩm thành công!');
        this.router.navigate(['/seller/products']);
      }
    } catch (error) {
      this.toastr.error(String(error), 'Đã xảy ra lỗi');
    } finally {
      this.isLoading.set(false);
    }
  }

  private buildFormData(formValue: any): FormData {
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('description', formValue.description || '');
    formData.append('brand', formValue.brand || '');
    formData.append('categoryId', formValue.categoryId.toString());

    const productImages = formValue.productImages as File[];
    if (productImages) {
      productImages.forEach((file) => {
        formData.append(`ProductImages`, file, file.name);
      });
    }

    formValue.variants.forEach((variant: any, index: number) => {
      formData.append(`Variants[${index}].SKU`, variant.sku);
      formData.append(`Variants[${index}].VariantSize`, variant.variantSize || '');
      formData.append(`Variants[${index}].Color`, variant.color || '');
      formData.append(`Variants[${index}].Material`, variant.material || '');
      formData.append(`Variants[${index}].Price`, variant.price.toString());
      formData.append(`Variants[${index}].Quantity`, variant.quantity.toString());

      if (variant.image instanceof File) {
        formData.append(`Variants[${index}].Image`, variant.image, variant.image.name);
      }
    });

    return formData;
  }

  isInvalid(controlName: string, formGroup: AbstractControl | null = null): boolean {
    const form = formGroup || this.productForm;
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onCancel() {
    this.router.navigate(['/seller/products']);
  }
}