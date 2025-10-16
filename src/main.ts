import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { enviroment } from './enviroments/enviroment';
import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { rootReducers } from './app/store/root.reducer';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

// Bật chế độ production => tắt các debug log , tôi ưu hiệu suất
if (enviroment.production) {
  enableProdMode();
}

// Temporarily leave routes empty if there is no router
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
  provideHttpClient(),
    DatePipe,
  importProvidersFrom(
    LoggerModule.forRoot({
      level: enviroment.production ? NgxLoggerLevel.OFF : NgxLoggerLevel.DEBUG, // log ra console
      serverLogLevel: NgxLoggerLevel.OFF, // không gửi API
      disableConsoleLogging: false, // Cho phép in ra console
      timestampFormat: 'DD/MM HH:mm:ss',
      colorScheme: ['purple', 'teal', 'gray', 'gray', 'red', 'red', 'red'] // Tùy chỉnh màu
    })),
  provideStore(rootReducers),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  provideAnimations(),
  provideToastr({
    timeOut: 3000,              // thời gian tự tắt (ms)
    positionClass: 'toast-top-right', // vị trí (xem list bên dưới)
    preventDuplicates: true,    // không trùng thông báo
    progressBar: true,          // thanh tiến trình
    progressAnimation: 'decreasing', // kiểu progress
    easeTime: 300,              // thời gian animation
    newestOnTop: true,          // hiện toast mới nhất lên đầu
  })
  ],
}).catch(err => console.error(err));
