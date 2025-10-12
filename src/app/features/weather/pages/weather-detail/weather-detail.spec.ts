import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherDetail } from './weather-detail';

describe('WeatherDetail', () => {
  let component: WeatherDetail;
  let fixture: ComponentFixture<WeatherDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
