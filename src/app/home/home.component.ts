import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AverageMonthsSalaryStatistics, EmployeesStatistics } from '@app/home/models/statistics-models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  employeesStats: EmployeesStatistics;
  rawGraphData: AverageMonthsSalaryStatistics;

  constructor(private route: ActivatedRoute) {
    this.rawGraphData = <AverageMonthsSalaryStatistics>this.route.snapshot.data.avgMonthSalary;
    this.employeesStats = <EmployeesStatistics>this.route.snapshot.data.employeesStats;
  }

  ngOnInit() {}
}
