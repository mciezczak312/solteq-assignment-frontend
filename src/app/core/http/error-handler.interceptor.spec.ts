import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ErrorHandlerInterceptor', () => {
  let errorHandlerInterceptor: ErrorHandlerInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let router: Router;

  function createInterceptor(_toastr: ToastrService, _router: Router) {
    errorHandlerInterceptor = new ErrorHandlerInterceptor(_router, _toastr);
    return errorHandlerInterceptor;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot()],
      providers: [
        {
          provide: Router,
          useClass: RouterTestingModule
        },
        ToastrService,
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: createInterceptor,
          deps: [ToastrService, Router],
          multi: true
        }
      ]
    });
  });

  beforeEach(inject(
    [HttpClient, HttpTestingController, Router, ToastrService],
    (_http: HttpClient, _httpMock: HttpTestingController, _router: Router, _toastr: ToastrService) => {
      http = _http;
      httpMock = _httpMock;
      router = _router;
      toastrService = _toastr;
    }
  ));

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch error and call error handler', () => {
    // Arrange
    // Note: here we spy on private method since target is customization here,
    // but you should replace it by actual behavior in your app
    spyOn(ErrorHandlerInterceptor.prototype as any, 'errorHandler').and.callThrough();

    // Act
    http.get('/toto').subscribe(
      () => fail('should error'),
      () => {
        // Assert
        expect(ErrorHandlerInterceptor.prototype['errorHandler']).toHaveBeenCalled();
      }
    );

    httpMock.expectOne({}).flush(null, {
      status: 404,
      statusText: 'error'
    });
  });
});
