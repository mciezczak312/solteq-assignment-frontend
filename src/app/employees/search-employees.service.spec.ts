import { inject, TestBed } from '@angular/core/testing';

import { SearchEmployeesService } from './search-employees.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { PageModel } from '@app/employees/models/page.model';
import {
  ApiPrefixInterceptor,
  CacheInterceptor,
  ErrorHandlerInterceptor,
  HttpCacheService,
  JwtInterceptor
} from '@app/core';
import { HttpService } from '@app/core/http/http.service';

describe('SearchEmployeesService', () => {
  let httpCacheService: HttpCacheService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorHandlerInterceptor,
        CacheInterceptor,
        ApiPrefixInterceptor,
        JwtInterceptor,
        HttpCacheService,
        {
          provide: HttpClient,
          useClass: HttpService
        }
      ]
    }));

  beforeEach(inject(
    [HttpClient, HttpTestingController, HttpCacheService],
    (_http: HttpClient, _httpMock: HttpTestingController, _httpCacheService: HttpCacheService) => {
      http = _http;
      httpMock = _httpMock;
      httpCacheService = _httpCacheService;
    }
  ));

  afterEach(() => {
    httpCacheService.cleanCache();
  });

  it('should be created', () => {
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    expect(service).toBeTruthy();
  });

  it('should add searchTerm param if present', () => {
    // Arrange
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    const pageModel: PageModel = {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'firstName;asc',
      totalElements: 0
    };

    // Act
    service.getPagedEmployeesData(pageModel, 'test').subscribe();

    // Assert
    const request = httpMock.expectOne(req => {
      return req.method === 'GET' && req.params.has('q');
    });

    request.flush({});
  });

  it('should not add searchTerm param', () => {
    // Arrange
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    const pageModel: PageModel = {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'firstName;asc',
      totalElements: 0
    };

    // Act
    service.getPagedEmployeesData(pageModel).subscribe();

    // Assert
    const request = httpMock.expectOne(req => {
      return req.method === 'GET' && !req.params.has('q');
    });

    request.flush({});
  });

  it('should add valid param for paging', () => {
    // Arrange
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    const mockPageModel: PageModel = {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'firstName;asc',
      totalElements: 0
    };

    // Act
    service.getPagedEmployeesData(mockPageModel, 'test').subscribe();

    // Assert
    const request = httpMock.expectOne(req => {
      return (
        req.method === 'GET' &&
        req.params.has('q') &&
        +req.params.get('take') === mockPageModel.pageSize &&
        +req.params.get('skip') === mockPageModel.pageNumber * mockPageModel.pageSize
      );
    });

    request.flush({});
  });

  it('should set default page number to 0', () => {
    // Arrange
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    const pageModel: PageModel = {
      pageNumber: null,
      pageSize: 10,
      orderBy: 'firstName;asc',
      totalElements: 0
    };

    // Act
    service.getPagedEmployeesData(pageModel, 'test').subscribe();

    // Assert
    const request = httpMock.expectOne(req => {
      return req.method === 'GET' && +req.params.get('skip') === 0;
    });

    request.flush({});
  });
});
