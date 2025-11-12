import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { Router } from "@angular/router";
import { NGXLogger } from "ngx-logger";
import { AddressBooksSerivce } from "src/services/address-books/address-books.service";

@Component({
    selector: 'app-address-select-dialog',
    standalone: true,
    imports: [CommonModule, MatIcon, MatRadioModule, MatDialogModule],
    template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Chọn địa chỉ giao hàng</h2>
        <button mat-dialog-close class="text-gray-400 hover:text-gray-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (addresses().length === 0) {
        <div class="text-center py-12">
          <mat-icon class="text-6xl text-gray-300 mb-4">location_off</mat-icon>
          <p class="text-gray-600 mb-6">Bạn chưa có địa chỉ nào</p>
          <button
            (click)="navigateToAddressBooks()"
            class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            <mat-icon>add</mat-icon>
            <span>Thêm địa chỉ mới</span>
          </button>
        </div>
      } @else {
        <div class="space-y-3 max-h-96 overflow-y-auto mb-6">
          @for (address of addresses(); track address.id) {
            <div
              (click)="selectAddress(address)"
              [class.ring-2]="selectedAddressId() === address.id"
              [class.ring-primary-600]="selectedAddressId() === address.id"
              [class.bg-primary-50]="selectedAddressId() === address.id"
              class="border rounded-lg p-4 cursor-pointer hover:border-primary-400 transition-all"
            >
              <div class="flex items-start gap-3">
                <input
                  type="radio"
                  [checked]="selectedAddressId() === address.id"
                  class="mt-1"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-semibold text-gray-800">{{ address.fullName }}</span>
                    @if (address.isDefault) {
                      <span class="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">Mặc định</span>
                    }
                  </div>
                  <p class="text-sm text-gray-600 mb-1">{{ address.phoneNumber }}</p>
                  <p class="text-sm text-gray-600">{{ address.addressDetail }}</p>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="flex gap-3">
          <button
            (click)="navigateToAddressBooks()"
            class="flex-1 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Quản lý địa chỉ
          </button>
          <button
            (click)="confirmSelection()"
            [disabled]="!selectedAddressId()"
            class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận
          </button>
        </div>
      }
    </div>
  `
})
export class AddressSelectDialogComponent implements OnInit {
    addresses = signal<any[]>([]);
    selectedAddressId = signal<number | null>(null);
    isLoading = signal(false);

    constructor(
        private readonly addressBookService: AddressBooksSerivce,
        private readonly logger: NGXLogger,
        private readonly router: Router,
        private readonly dialog: MatDialog,
    ) { }

    async ngOnInit() {
        await this.loadAddresses();
    }

    async loadAddresses() {
        try {
            this.isLoading.set(true);
            const response = await this.addressBookService.getAll();
            this.addresses.set(response);

            // Tự động chọn địa chỉ mặc định
            const defaultAddress = response.find((addr: any) => addr.isDefault);
            if (defaultAddress) {
                this.selectedAddressId.set(defaultAddress.id);
            }
        } catch (error) {
            this.logger.error('Error loading addresses:', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    selectAddress(address: any) {
        this.selectedAddressId.set(address.id);
    }

    confirmSelection() {
        const selected = this.addresses().find(addr => addr.id === this.selectedAddressId());
        this.dialog.closeAll();
        // Return selected address through dialog result
        if (selected) {
            this.dialog.getDialogById('address-select')?.close(selected);
        }
    }

    navigateToAddressBooks() {
        this.dialog.closeAll();
        this.router.navigate(['/address-books']);
    }
}