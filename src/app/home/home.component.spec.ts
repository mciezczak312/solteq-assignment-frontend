import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeComponent } from './home.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardBlockComponent } from '@app/home/dashboard-block/dashboard-block.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { AverageSalaryGraphComponent } from '@app/home/average-salary-graph/average-salary-graph.component';
import { EmployeesStatistics } from '@app/home/models/statistics-models';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const avgSalaryStub = {
    timeStamp: '2018-09-29T15:16:22.3115741+03:00',
    data: [
      {
        amount: 4142.0949,
        monthName: 'January',
        year: 2017
      }
    ]
  };
  const employeesStatsStub = {
    averageCurrentSalary: 2000,
    employeesCount: 100
  } as EmployeesStatistics;

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
      declarations: [HomeComponent, DashboardBlockComponent, AverageSalaryGraphComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { avgMonthSalary: avgSalaryStub, employeesStats: employeesStatsStub } } }
        }
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
