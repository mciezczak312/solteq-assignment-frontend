import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardBlockComponent } from '@app/home/dashboard-block/dashboard-block.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const resolverDataStub = {
    salaryIntervals: [
      {
        name: '10 000€ - 28 000€',
        value: 32
      },
      {
        name: '28 001€ - 46 000€',
        value: 18
      },
      {
        name: '46 001€ - 64 000€',
        value: 9
      }
    ],
    avgSalary: 3643.51,
    employeesCount: 100,
    timeStamp: '2019-01-01 12-23'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule,
        HttpClientTestingModule,
        NgxChartsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [HomeComponent, DashboardBlockComponent],
      providers: [
        QuoteService,
        { provide: ActivatedRoute, useValue: { snapshot: { data: { stats: resolverDataStub } } } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
