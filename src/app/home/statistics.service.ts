import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeesStatisticsModel } from '@app/home/models/employees-statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private httpClient: HttpClient) {}

  getEmployeesStatistics(): Observable<EmployeesStatisticsModel> {
    return this.httpClient.cache().get<EmployeesStatisticsModel>('/stats/employees');
  }
}
