import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-weather-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Weather Forecast</h2>
    @if (weatherService.loading()) {
      <p>Loading...</p>
    } @else if (weatherService.error()) {
      <p>Error: {{ weatherService.error() }}</p>
    } @else {
      <ul>
        @for (f of weatherService.forecasts(); track f.date) {
          <li>{{ f.date }} - {{ f.temperatureC }}°C - {{ f.summary }}</li>
        } @empty {
          <li>No forecasts available.</li>
        }
      </ul>
    }
  `,
  styles: [`
    h2 { color: darkblue; }
    ul { list-style: none; padding: 0; }
    li { margin: 4px 0; }
  `]
})
export class WeatherList {
  constructor(public weatherService: WeatherService) {
    this.weatherService.loadForecasts();
  }
}
