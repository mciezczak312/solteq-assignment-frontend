import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from './models/position.model';
import { publishLast, refCount } from 'rxjs/operators';
import { EmployeeDto } from '@app/employees/models/employee-dto.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Returns list of defined positions
   */

  getPositionsDictionary(): Observable<Position[]> {
    return this.httpClient
      .cache()
      .get<Position[]>('/dictionary/positions')
      .pipe(
        publishLast(),
        refCount()
      );
  }

  /**
   * Returns employee by id
   *
   * @param id Employee ID
   */

  getEmployeeById(id: number): Observable<EmployeeDto> {
    return this.httpClient.cache().get<EmployeeDto>('/employees/' + id);
  }

  /**
   * Removes employee
   * @param id Employee ID
   */

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete('/employees/' + id);
  }

  /**
   * Adds new employee
   * @param employee Employee DTO
   */

  addNewEmployee(employee: EmployeeDto): Observable<number> {
    return this.httpClient.post<number>('/employees', employee);
  }

  /**
   * Updates existing employeee. DTO object has to contain employee ID
   * @param employee Employee DTO
   */

  updateEmployee(employee: EmployeeDto): Observable<any> {
    return this.httpClient.put(`/employees/${employee.id}`, employee);
  }
}
