// app/app.routes.ts
import { Routes } from '@angular/router';
import { WeatherPage } from './features/weather/pages/weather-page/weather-page';

export const routes: Routes = [
  { path: 'weather', loadChildren: () => import('./features/weather/weather.routes').then(m => m.weatherRoutes)}
  
];
