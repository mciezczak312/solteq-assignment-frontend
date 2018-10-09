import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StatisticsService } from '@app/home/statistics.service';
import { AverageMonthsSalaryStatistics } from '@app/home/models/statistics-models';

@Injectable()
export class AverageMonthSalaryResolver implements Resolve<AverageMonthsSalaryStatistics> {
  constructor(private statisticsService: StatisticsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.statisticsService.getAverageMonthsSalaryStatistics();
  }
}
