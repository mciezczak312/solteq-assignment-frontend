import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageSalaryGraphComponent } from './average-salary-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AverageMonthsSalaryStatistics } from '@app/home/models/statistics-models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AverageSalaryGraphComponent', () => {
  let component: AverageSalaryGraphComponent;
  let fixture: ComponentFixture<AverageSalaryGraphComponent>;
  const dataGraphStub: AverageMonthsSalaryStatistics = {
    data: [
      {
        year: 997,
        amount: 23,
        monthName: 'May'
      }
    ],
    timeStamp: new Date().toISOString()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxChartsModule, NoopAnimationsModule],
      declarations: [AverageSalaryGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageSalaryGraphComponent);
    component = fixture.componentInstance;
    component.statsDataGraphRaw = dataGraphStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
