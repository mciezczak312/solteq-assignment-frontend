import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AverageMonthsSalaryStatistics, EmployeesStatistics } from '@app/home/models/statistics-models';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}

  getAverageMonthsSalaryStatistics(): Observable<AverageMonthsSalaryStatistics> {
    return this.httpClient.cache().get<AverageMonthsSalaryStatistics>('/stats/avgSalary');
  }

  getEmployeesStatistics(): Observable<EmployeesStatistics> {
    return this.httpClient.cache().get<EmployeesStatistics>('/stats/employees');
  }
}
