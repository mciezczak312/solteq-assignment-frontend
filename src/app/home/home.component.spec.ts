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
    timeStamp: '2018-09-29T15:16:22.3115741+03:00',
    data: [
      {
        amount: 4142.0949,
        monthName: 'January',
        year: 2017
      }
    ]
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
