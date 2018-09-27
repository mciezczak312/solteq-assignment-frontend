import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StatisticsService } from '@app/home/statistics.service';
import { EmployeesStatisticsModel } from '@app/home/models/employees-statistics.model';

@Injectable()
export class StatsResolver implements Resolve<EmployeesStatisticsModel> {
  constructor(private backend: StatisticsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.backend.getEmployeesStatistics();
  }
}
