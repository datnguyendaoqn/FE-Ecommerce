import { Component, OnInit, signal } from '@angular/core'; 
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/component/ui/confirm-dialog/confirm-dialog';

import { SellerProductService } from 'src/services/seller-product/seller-product.service';
import { SellerProductDetailDto, SellerProductVariantDetailDto, ProductMediaDto } from '@dtos/product/seller-product-detail.dto';
import { CategoryService } from 'src/services/category/category.service';
import { RecursiveCategoryDto } from '@dtos/category/category.dto';
import { UpdateProductRequestDto } from '@dtos/product/update-product.request.dto';
import { NgxCurrencyDirective, NgxCurrencyInputMode } from "ngx-currency";


interface UpdateProductVariantRequestDto {
  sku: string;
  variantSize: string | null;
  color: string | null;
  material: string | null;
  price: number;
  quantity: number;
}


@Component({
  selector: 'app-seller-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIcon,
    ReactiveFormsModule,
    MatDialogModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './product-form.html',
})
export class SellerProductFormComponent implements OnInit {

  productForm: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  productId = signal<number | null>(null);

  productGallery = signal<ProductMediaDto[]>([]);
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
  
  // QUAN TRỌNG: Quản lý files riêng biệt, KHÔNG dùng FormControl
  productImageFiles = signal<File[]>([]);
  variantImageFiles = signal<Map<number, File>>(new Map()); // index -> File
  allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor(
    private fb: FormBuilder,
    private sellerProductService: SellerProductService,
    private toastr: ToastrService,
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {
    this.productForm = this.initForm(); 
  }

  configCurrency = {
    align: "left",
    allowNegative: false,
    allowZero: true,
    precision: 0,
    prefix: "",
    suffix: " VNĐ",
    thousands: ".",
    nullable: true,
    min: 0,
    max: 10000000,
    inputMode: NgxCurrencyInputMode.Financial
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

  private flattenCategories(categories: RecursiveCategoryDto[], prefix = ''): RecursiveCategoryDto[] {
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
    const variantGroups: FormGroup[] = [];
    if (product && product.variants.length > 0) {
      product.variants.forEach(variant => {
        variantGroups.push(this.createVariantGroup(variant));
      });
    } else if (!product) {
      variantGroups.push(this.createVariantGroup(null));
    }

    const form = this.fb.group({
      name: [product?.name || '', [Validators.required, Validators.maxLength(200)]],
      description: [product?.description || ''],
      brand: [product?.brand || ''],
      categoryId: [product?.categoryId || null, [Validators.required]],
      // LOẠI BỎ FormControl cho productImages
      variants: this.fb.array(variantGroups) 
    });

    return form;
  }

  async loadProductForEdit(id: number) {
    this.isLoading.set(true);
    try {
      const product = await this.sellerProductService.getProductDetail(id); 
      this.productForm = this.initForm(product); 
      this.productGallery.set(product.productImages || []);
      
    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải sản phẩm');
      this.router.navigate(['/seller/products']);
    } finally {
      this.isLoading.set(false);
    }
  }

  createVariantGroup(variant: SellerProductVariantDetailDto | null): FormGroup {
    return this.fb.group({
      id: [variant?.id || null],
      sku: [variant?.sku || '', [Validators.required]],
      variantSize: [variant?.variantSize || null], 
      color: [variant?.color || null], 
      material: [variant?.material || null, [Validators.required]],
      price: [variant?.price || 1000, [Validators.required, Validators.min(1000)]],
      quantity: [variant?.quantity || 0, [Validators.required, Validators.min(0)]],
      // LOẠI BỎ FormControl cho image
      primaryImage: [variant?.primaryImage || null],
      hasImageFile: [false] // Flag để track xem có file mới không
    });
  }

  get variantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addVariantToForm() {
    this.variantsArray.push(this.createVariantGroup(null));
  }

  async removeVariant(index: number) {
    if (this.variantsArray.length <= 1) {
      this.toastr.warning('Sản phẩm phải có ít nhất 1 phân loại hàng.', 'Không thể xóa');
      return;
    }
    
    const variantGroup = this.variantsArray.at(index);
    const variantId = variantGroup.get('id')?.value; 
    if (variantId && this.isEditMode() && this.productId()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: 'Xác nhận Xóa Biến thể',
          message: `Bạn có chắc muốn XÓA VĨNH VIỄN biến thể (SKU: ${variantGroup.get('sku')?.value}) này khỏi CSDL?`,
          confirmText: 'Đồng ý Xóa',
        }
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === true) {
          this.isLoading.set(true);
          try {
            await this.sellerProductService.deleteVariant(this.productId()!, variantId);
            this.variantsArray.removeAt(index);
            // Xóa file đã lưu nếu có
            this.variantImageFiles.update(map => {
              map.delete(index);
              return new Map(map);
            });
            this.toastr.success('Xóa biến thể thành công.');
          } catch (error) {
            this.toastr.error(String(error), 'Lỗi xóa biến thể');
          } finally {
            this.isLoading.set(false);
          }
        }
      });
    } else {
      this.variantsArray.removeAt(index);
      this.variantImageFiles.update(map => {
        map.delete(index);
        return new Map(map);
      });
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
      if (validFiles.length === 0) input.value = ''; 
    }
  }

  onVariantFileChange(event: Event, variantIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const validFiles = this.validateFiles(input.files);
      const variantGroup = this.variantsArray.at(variantIndex) as FormGroup;
      if (validFiles.length > 0) {
        const file = validFiles[0];
        // Lưu file vào Map
        this.variantImageFiles.update(map => {
          map.set(variantIndex, file);
          return new Map(map);
        });
        // Set flag
        variantGroup.patchValue({ hasImageFile: true });
      } else {
        this.variantImageFiles.update(map => {
          map.delete(variantIndex);
          return new Map(map);
        });
        variantGroup.patchValue({ hasImageFile: false });
        input.value = ''; 
      }
    }
  }

  // Hàm kiểm tra variant có ảnh chưa (cho validation)
  variantHasImage(index: number): boolean {
    const variantGroup = this.variantsArray.at(index) as FormGroup;
    const hasExistingImage = !!variantGroup.get('primaryImage')?.value;
    const hasNewFile = this.variantImageFiles().has(index);
    return hasExistingImage || hasNewFile;
  }

  async onSubmit() {
    const basicInfoForm = this.fb.group({
      name: this.productForm.get('name')!,
      categoryId: this.productForm.get('categoryId')!,
    });
    
    if (basicInfoForm.invalid) {
      this.toastr.error('Vui lòng điền Tên sản phẩm và Danh mục.');
      basicInfoForm.markAllAsTouched(); 
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
        this.toastr.success('Cập nhật thông tin cơ bản thành công!');
      } else {
        // Validate form và files
        if (this.productForm.invalid) {
          this.toastr.error('Vui lòng điền đầy đủ các trường bắt buộc (*).');
          this.productForm.markAllAsTouched();
          this.isLoading.set(false);
          return;
        }

        if (this.productImageFiles().length === 0) {
          this.toastr.error('Vui lòng chọn ít nhất 1 ảnh sản phẩm.');
          this.isLoading.set(false);
          return;
        }

        // Validate variant images
        for (let i = 0; i < this.variantsArray.length; i++) {
          if (!this.variantHasImage(i)) {
            this.toastr.error(`Phân loại hàng ${i + 1} chưa có ảnh.`);
            this.isLoading.set(false);
            return;
          }
        }

        const formData = this.buildCreateFormData(this.productForm.value);
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
  
  async onSaveVariant(index: number) {
    const variantGroup = this.variantsArray.at(index) as FormGroup;
    
    // Kiểm tra ảnh cho variant mới
    if (variantGroup.value.id === null && !this.variantHasImage(index)) {
      this.toastr.error('Vui lòng thêm ảnh cho biến thể mới.');
      variantGroup.markAllAsTouched();
      return;
    }
    
    if (variantGroup.invalid) {
      this.toastr.error('Vui lòng điền đủ thông tin cho biến thể (SKU, Chất liệu, Giá, SL).');
      variantGroup.markAllAsTouched();
      return;
    }
    
    this.isLoading.set(true);
    const variantId = variantGroup.value.id;
    
    try {
      if (variantId) {
        // CẬP NHẬT VARIANT ĐÃ CÓ
        const dto: UpdateProductVariantRequestDto = {
          sku: variantGroup.value.sku,
          variantSize: variantGroup.value.variantSize,
          color: variantGroup.value.color,
          material: variantGroup.value.material,
          price: variantGroup.value.price, 
          quantity: variantGroup.value.quantity
        };
        await this.sellerProductService.updateVariant(this.productId()!, variantId, dto);
        this.toastr.success(`Đã cập nhật biến thể (SKU: ${dto.sku})`);
        variantGroup.markAsPristine(); 
        
      } else {
        // THÊM VARIANT MỚI
        const formData = this.buildVariantFormData(index);
        const newVariant = await this.sellerProductService.addVariant(this.productId()!, formData);
        
        variantGroup.patchValue({
          id: newVariant.id,
          primaryImage: newVariant.primaryImage,
          hasImageFile: false
        });
        
        // Xóa file đã upload
        this.variantImageFiles.update(map => {
          map.delete(index);
          return new Map(map);
        });
        
        variantGroup.markAsPristine(); 
        this.toastr.success(`Đã thêm biến thể mới (SKU: ${newVariant.sku})`);
      }
    } catch (error) {
      this.toastr.error(String(error), 'Lỗi lưu biến thể');
    } finally {
      this.isLoading.set(false);
    }
  }

  private buildCreateFormData(formValue: any): FormData {
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('description', formValue.description || '');
    formData.append('brand', formValue.brand || '');
    formData.append('categoryId', formValue.categoryId.toString());
    
    // Thêm product images từ signal
    this.productImageFiles().forEach((file) => {
      formData.append(`ProductImages`, file, file.name);
    });
    
    formValue.variants.forEach((variant: any, index: number) => {
      formData.append(`Variants[${index}].SKU`, variant.sku);
      formData.append(`Variants[${index}].VariantSize`, variant.variantSize || '');
      formData.append(`Variants[${index}].Color`, variant.color || '');
      formData.append(`Variants[${index}].Material`, variant.material || ''); 
      formData.append(`Variants[${index}].Price`, variant.price.toString()); 
      formData.append(`Variants[${index}].Quantity`, variant.quantity.toString());
      
      // Lấy file từ Map
      const file = this.variantImageFiles().get(index);
      if (file) {
        formData.append(`Variants[${index}].Image`, file, file.name);
      }
    });
    return formData;
  }

  private buildVariantFormData(variantIndex: number): FormData {
    const variantValue = this.variantsArray.at(variantIndex).value;
    const formData = new FormData();
    formData.append('SKU', variantValue.sku);
    formData.append('VariantSize', variantValue.variantSize || '');
    formData.append('Color', variantValue.color || '');
    formData.append('Material', variantValue.material || '');
    formData.append('Price', variantValue.price.toString());
    formData.append('Quantity', variantValue.quantity.toString());
    
    const file = this.variantImageFiles().get(variantIndex);
    if (file) {
      formData.append('Image', file, file.name);
    }
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
  
  async onAddGalleryImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const validFiles = this.validateFiles(input.files);
    if (validFiles.length === 0) return;

    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append('images', file, file.name); 
    });

    this.isLoading.set(true);
    try {
      const response = await this.sellerProductService.addGalleryImages(this.productId()!, formData);
      this.productGallery.update(currentGallery => [
        ...currentGallery,
        ...response.addedImages
      ]);
      this.toastr.success(`Đã thêm ${response.addedImages.length} ảnh mới.`);
    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải ảnh lên');
    } finally {
      this.isLoading.set(false);
      input.value = ''; 
    }
  }

  async onDeleteGalleryImage(mediaId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xác nhận Xóa Ảnh',
        message: `Bạn có chắc muốn XÓA ảnh này khỏi gallery?`,
        confirmText: 'Đồng ý Xóa',
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        this.isLoading.set(true);
        try {
          await this.sellerProductService.deleteMedia(mediaId);
          this.productGallery.update(currentGallery => 
            currentGallery.filter(img => img.id !== mediaId)
          );
          this.toastr.success('Đã xóa ảnh.');
        } catch (error) {
          this.toastr.error(String(error), 'Lỗi xóa ảnh');
        } finally {
          this.isLoading.set(false);
        }
      }
    });
  }

  async onDeleteVariantImage(index: number) {
    const variantGroup = this.variantsArray.at(index) as FormGroup;
    const mediaObj = variantGroup.get('primaryImage')?.value as (ProductMediaDto | null);

    if (!mediaObj) {
      this.toastr.error('Biến thể này không có ảnh để xóa.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xác nhận Xóa Ảnh Biến Thể',
        message: `Bạn có chắc muốn XÓA ảnh của biến thể (SKU: ${variantGroup.get('sku')?.value})?`,
        confirmText: 'Đồng ý Xóa',
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        this.isLoading.set(true);
        try {
          await this.sellerProductService.deleteMedia(mediaObj.id);
          // Chỉ cần set primaryImage = null
          variantGroup.patchValue({
            primaryImage: null
          });
          
          this.toastr.success('Đã xóa ảnh của biến thể. Bạn có thể tải lên ảnh mới.');
        } catch (error) {
          this.toastr.error(String(error), 'Lỗi xóa ảnh');
        } finally {
          this.isLoading.set(false);
        }
      }
    });
  }

  async onDeleteProduct() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xác nhận Xóa Sản phẩm (NGUY HIỂM)',
        message: `Bạn có chắc chắn muốn XÓA toàn bộ sản phẩm này không?`,
        confirmText: 'Xóa',
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        this.isLoading.set(true);
        try {
          await this.sellerProductService.deleteProduct(this.productId()!);
          this.toastr.success('Đã xóa sản phẩm thành công.');
          this.router.navigate(['/seller/products']); 
        } catch (error) {
          this.toastr.error(String(error), 'Lỗi xóa sản phẩm');
        } finally {
          this.isLoading.set(false);
        }
      }
    });
  }
}