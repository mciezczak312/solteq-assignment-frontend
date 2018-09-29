import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpInterceptor } from '@angular/common/http';

import { HttpCacheService } from '@app/core';
import { ErrorHandlerInterceptor } from '@app/core';
import { CacheInterceptor } from '@app/core';
import { ApiPrefixInterceptor } from '@app/core';
import { JwtInterceptor } from '@app/core/http/jwt.interceptor';
import { HttpService } from '@app/core/http/http.service';

describe('HttpService', () => {
  let httpCacheService: HttpCacheService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
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
    });
  });

  beforeEach(inject(
    [HttpClient, HttpTestingController, HttpCacheService],
    (_http: HttpClient, _httpMock: HttpTestingController, _httpCacheService: HttpCacheService) => {
      http = _http;
      httpMock = _httpMock;
      httpCacheService = _httpCacheService;

      let store = {};

      spyOn(localStorage, 'getItem').and.callFake(
        (key: string): String => {
          return store[key] || null;
        }
      );
      spyOn(localStorage, 'removeItem').and.callFake(
        (key: string): void => {
          delete store[key];
        }
      );
      spyOn(localStorage, 'setItem').and.callFake(
        (key: string, value: string): string => {
          return (store[key] = <string>value);
        }
      );
      spyOn(localStorage, 'clear').and.callFake(() => {
        store = {};
      });
    }
  ));

  afterEach(() => {
    httpCacheService.cleanCache();
    httpMock.verify();
  });

  it('should use error handler, API prefix, JWT, no cache by default', () => {
    // Arrange

    let interceptors: HttpInterceptor[];
    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(function(this: any) {
      interceptors = this.interceptors;
      return realRequest.apply(this, arguments);
    });

    // Act
    const request = http.get('/toto');

    // Assert
    request.subscribe(() => {
      expect(http.request).toHaveBeenCalled();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof JwtInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should use cache', () => {
    // Arrange
    let interceptors: HttpInterceptor[];
    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(function(this: any) {
      interceptors = this.interceptors;
      return realRequest.apply(this, arguments);
    });

    // Act
    const request = http.cache().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof JwtInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeTruthy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should skip error handler', () => {
    // Arrange
    let interceptors: HttpInterceptor[];
    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(function(this: any) {
      interceptors = this.interceptors;
      return realRequest.apply(this, arguments);
    });

    // Act
    const request = http.skipErrorHandler().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeFalsy();
      expect(interceptors.some(i => i instanceof JwtInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should not use API prefix', () => {
    // Arrange
    let interceptors: HttpInterceptor[];
    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(function(this: any) {
      interceptors = this.interceptors;
      return realRequest.apply(this, arguments);
    });

    // Act
    const request = http.disableApiPrefix().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeFalsy();
      expect(interceptors.some(i => i instanceof ErrorHandlerInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof JwtInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
    });
    httpMock.expectOne({}).flush({});
  });
});
