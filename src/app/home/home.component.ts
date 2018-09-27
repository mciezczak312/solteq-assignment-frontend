import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesStatisticsModel } from '@app/home/models/employees-statistics.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean;
  statsData: EmployeesStatisticsModel;

  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'No. of employees'; // TODO translation
  showYAxisLabel = true;
  yAxisLabel = 'Salary'; // TODO translation

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private route: ActivatedRoute) {
    this.statsData = <EmployeesStatisticsModel>this.route.snapshot.data.stats;
  }

  ngOnInit() {}
}
