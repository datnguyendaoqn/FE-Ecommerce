import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

import { AddressBooksSerivce } from 'src/services/address-books/address-books.service';
import { AddressBooks } from '@dtos/address-books/address-books';
import { AddressBooksRequestDto } from '@dtos/address-books/address-books.request.dto';
import { IProvince, IDistrict, IWard } from '@dtos/location/location';
import { LocationService } from 'src/services/locatiton/location.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatIcon,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './address-book.html',
})
export class AddressBookComponent implements OnInit {
  addresses = signal<AddressBooks[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  loading = signal(false);
  addressForm!: FormGroup;

  // Data từ API
  provinces = signal<IProvince[]>([]);
  districts = signal<IDistrict[]>([]);
  wards = signal<IWard[]>([]);

  constructor(
    private readonly fb: FormBuilder,
    private readonly addressBookService: AddressBooksSerivce,
    private readonly locationService: LocationService,
    private readonly toast: ToastrService,
    private readonly logger: NGXLogger
  ) {
    this.initForm();
  }

  async ngOnInit() {
    await Promise.all([
      this.loadProvinces(),
      this.loadAddresses()
    ]);
  }

  initForm() {
    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      addressLine: ['', [Validators.required, Validators.minLength(5)]],
      provinceCode: ['', Validators.required],
      districtCode: ['', Validators.required],
      wardCode: ['', Validators.required],
      isDefault: [false]
    });

    // Listen to province changes
    this.addressForm.get('provinceCode')?.valueChanges.subscribe(async provinceCode => {
      if (provinceCode) {
        await this.loadDistricts(provinceCode);
      }
    });

    // Listen to district changes
    this.addressForm.get('districtCode')?.valueChanges.subscribe(async districtCode => {
      if (districtCode) {
        await this.loadWards(districtCode);
      }
    });
  }

  async loadProvinces() {
    try {
      const response = await this.locationService.getProvinces();
      this.provinces.set(response.data);
    } catch (error) {
      this.logger.error('Error loading provinces:', error);
      this.toast.error('Không thể tải danh sách tỉnh/thành phố', 'Lỗi');
    }
  }

  async loadDistricts(provinceCode: string) {
    try {
      const response = await this.locationService.getDistricts(provinceCode);
      this.districts.set(response.data);
      // Reset district và ward
      this.addressForm.patchValue({
        districtCode: '',
        wardCode: ''
      }, { emitEvent: false });
      this.wards.set([]);
    } catch (error) {
      this.logger.error('Error loading districts:', error);
      this.toast.error('Không thể tải danh sách quận/huyện', 'Lỗi');
    }
  }

  async loadWards(districtCode: string) {
    try {
      const response = await this.locationService.getWards(districtCode);
      this.wards.set(response.data);

      // Reset ward
      this.addressForm.patchValue({
        wardCode: ''
      }, { emitEvent: false });
    } catch (error) {
      this.logger.error('Error loading wards:', error);
      this.toast.error('Không thể tải danh sách phường/xã', 'Lỗi');
    }
  }

  async loadAddresses() {
    try {
      this.loading.set(true);
      const response = await this.addressBookService.getAll();
      this.addresses.set(response);
    } catch (error) {
      this.logger.error('Error loading addresses:', error);
      this.toast.error('Không thể tải danh sách địa chỉ', 'Lỗi');
    } finally {
      this.loading.set(false);
    }
  }

  openForm() {
    this.showForm.set(true);
    this.editingId.set(null);
    this.addressForm.reset({ isDefault: false });
    this.districts.set([]);
    this.wards.set([]);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.addressForm.reset();
    this.districts.set([]);
    this.wards.set([]);
  }

  async editAddress(address: AddressBooks) {
    this.editingId.set(address.id);
    this.showForm.set(true);

    // Load districts và wards theo thứ tự
    await this.loadDistricts(address.provinceCode);
    await this.loadWards(address.districtCode);

    // Sau khi load xong mới set value
    this.addressForm.patchValue({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      provinceCode: address.provinceCode,
      districtCode: address.districtCode,
      wardCode: address.wardCode,
      isDefault: address.isDefault
    }, { emitEvent: false });
  }

  async saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.toast.warning('Vui lòng điền đầy đủ thông tin', 'Cảnh báo');
      return;
    }

    try {
      this.loading.set(true);
      const formValue = this.addressForm.value as AddressBooksRequestDto;
      const editingId = this.editingId();

      if (editingId) {
        await this.addressBookService.update(editingId, formValue);
        this.toast.success('Cập nhật địa chỉ thành công!', 'Thành công');
      } else {
        await this.addressBookService.create(formValue);
        this.toast.success('Thêm địa chỉ mới thành công!', 'Thành công');
      }

      await this.loadAddresses();
      this.closeForm();
    } catch (error) {
      this.logger.error('Error saving address:', error);
      this.toast.error('Không thể lưu địa chỉ', 'Lỗi');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteAddress(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      this.loading.set(true);
      await this.addressBookService.delete(id);
      this.toast.success('Xóa địa chỉ thành công!', 'Thành công');
      await this.loadAddresses();
    } catch (error) {
      this.logger.error('Error deleting address:', error);
      this.toast.error('Không thể xóa địa chỉ', 'Lỗi');
    } finally {
      this.loading.set(false);
    }
  }

  async setDefault(id: number) {
    try {
      this.loading.set(true);
      await this.addressBookService.setAddressBookDefault(id);
      this.toast.success('Đã đặt làm địa chỉ mặc định!', 'Thành công');
      await this.loadAddresses();
    } catch (error) {
      this.logger.error('Error setting default address:', error);
      this.toast.error('Không thể đặt địa chỉ mặc định', 'Lỗi');
    } finally {
      this.loading.set(false);
    }
  }

  // Helper methods for template
  getFormControl(name: string) {
    return this.addressForm.get(name);
  }

  hasError(name: string, error: string): boolean {
    const control = this.getFormControl(name);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  getFullAddress(address: AddressBooks): string {
    return `${address.addressLine}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`;
  }
}