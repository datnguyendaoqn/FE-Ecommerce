// features/weather/weather.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherForecast } from '../models/weather.model';

@Injectable()
export class WeatherService {
  forecasts = signal<WeatherForecast[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadForecasts() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<WeatherForecast[]>('api/weatherforecast').subscribe({
      next: (data) => this.forecasts.set(data),
      error: (err) => this.error.set(err.message),
      complete: () => this.loading.set(false)
    });
  }
}
