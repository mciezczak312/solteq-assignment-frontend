import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule, I18nService } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeComponent } from './home.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardBlockComponent } from '@app/home/dashboard-block/dashboard-block.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { AverageSalaryGraphComponent } from '@app/home/average-salary-graph/average-salary-graph.component';
import { EmployeesStatistics } from '@app/home/models/statistics-models';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

class MockTranslateService {
  currentLang: string;
  onLangChange = new Subject();

  use(language: string) {
    this.currentLang = language;
    this.onLangChange.next({
      lang: this.currentLang,
      translations: {}
    });
  }

  getBrowserCultureLang() {
    return 'en-US';
  }

  setTranslation(lang: string, translations: Object, shouldMerge?: boolean) {}
}

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

  let translateService: TranslateService;
  let onLangChangeSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        TranslateModule,
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
        },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();
  }));

  beforeEach(inject(
    [I18nService, TranslateService],
    (_translateService: TranslateService) => {
      translateService = _translateService;

      // Create spies
      onLangChangeSpy = jasmine.createSpy('onLangChangeSpy');
      translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        onLangChangeSpy(event.lang);
      });
      spyOn(translateService, 'use').and.callThrough();

      const store = {};
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        },
        setItem: (key: string, value: string) => {
          store[key] = `${value}`;
        },
        removeItem: (key: string) => {
          delete store[key];
        }
      };

      spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
      spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

});
