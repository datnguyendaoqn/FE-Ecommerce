// features/weather/pages/weather-page/weather-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherList } from '../../components/weather-list';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-page',
  standalone: true,
  imports: [CommonModule, WeatherList],
  providers: [WeatherService],
  template: `
    <h1>Weather Page</h1>
    <app-weather-list></app-weather-list>
  `,
  styles: [`
    h1 { font-size: 24px; margin-bottom: 16px; }
  `]
})
export class WeatherPage {

}
