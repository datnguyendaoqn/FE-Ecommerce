// features/weather/weather.routes.ts
import { Routes } from '@angular/router';
import { WeatherPage } from './pages/weather-page/weather-page';

export const weatherRoutes: Routes = [
  {
    path: '', // /weather
    component: WeatherPage
  },
  {
    path:'detail', // /weather/detail
    loadComponent: () => import('./components/weather-detail').then(c => c.WeatherDetail)
  }
];
