import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AverageMonthsSalaryStatistics, EmployeesStatistics } from '@app/home/models/statistics-models';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}


  /**
   * Returns list of average salary per month
   * @return {Observable<AverageMonthsSalaryStatistics>} Mapped observable of http response
   */
  getAverageMonthsSalaryStatistics(): Observable<AverageMonthsSalaryStatistics> {
    return this.httpClient.cache().get<AverageMonthsSalaryStatistics>('/stats/avgSalary');
  }

  /**
   * Returns basic stats about employees like count, current average salary
   * @return {Observable<EmployeesStatistics>} Mapped observable of http response
   */
  getEmployeesStatistics(): Observable<EmployeesStatistics> {
    return this.httpClient.cache().get<EmployeesStatistics>('/stats/employees');
  }
}
