import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { JwtInterceptor } from '@app/core';

describe('JwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(inject([HttpClient, HttpTestingController], (_http: HttpClient, _httpMock: HttpTestingController) => {
    http = _http;
    httpMock = _httpMock;

    const store = {};

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
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if user credentials in store', () => {
    const token = 'testToken';
    localStorage.setItem('ems-credentials-key', JSON.stringify({ username: 'test', token: token }));

    http.post('/auth', {}).subscribe();

    const req = httpMock.expectOne(r => {
      return r.headers.has('Authorization') && r.headers.get('Authorization') === `Bearer ${token}`;
    });
    expect(req.request.method).toEqual('POST');

    req.flush({});
  });

  it('should not add authorization header', () => {
    localStorage.clear();
    http.get('/auth').subscribe();
    const req = httpMock.expectOne(r => {
      return !r.headers.has('Authorization');
    });
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });
});
