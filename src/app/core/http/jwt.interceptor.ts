import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '@app/core';

import { Logger } from '../logger.service';

const log = new Logger('JwtInterceptor');

const credentialsKey = 'ems-credentials-key';

/**
 * Sets authorization header
 */

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser: Credentials = JSON.parse(localStorage.getItem(credentialsKey));
    if (currentUser && currentUser.token) {
      log.debug('Adding JWT token to request: ');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }
}
