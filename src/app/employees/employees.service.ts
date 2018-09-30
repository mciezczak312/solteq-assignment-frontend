import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from './models/position';
import { publishLast, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private httpClient: HttpClient) { }

  getPositionsDictionary(): Observable<Position[]> {
    return this.httpClient.cache().get<Position[]>('/dictionary/positions').pipe(publishLast(), refCount());
  }


}
