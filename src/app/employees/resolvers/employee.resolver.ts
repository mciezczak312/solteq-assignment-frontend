import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EmployeeDto } from '@app/employees/models/employee-dto.model';
import { EmployeesService } from '@app/employees/employees.service';

@Injectable()
export class EmployeeResolver implements Resolve<EmployeeDto> {
  constructor(private backend: EmployeesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    if (+route.params.id === 0) {
      return of(null);
    } else {
      return this.backend.getEmployeeById(+route.params.id);
    }
  }
}
