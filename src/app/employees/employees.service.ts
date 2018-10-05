import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from './models/position';
import { publishLast, refCount } from 'rxjs/operators';
import { EmployeeDto } from '@app/employees/models/employee-dto.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private httpClient: HttpClient) {}

  getPositionsDictionary(): Observable<Position[]> {
    return this.httpClient
      .cache()
      .get<Position[]>('/dictionary/positions')
      .pipe(
        publishLast(),
        refCount()
      );
  }

  getEmployeeById(id: number): Observable<EmployeeDto> {
    return this.httpClient.cache().get<EmployeeDto>('/employees/' + id);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete('/employees/' + id);
  }

  addNewEmployee(employee: EmployeeDto): Observable<number> {
    return this.httpClient.post<number>('/employees', employee);
  }
}
