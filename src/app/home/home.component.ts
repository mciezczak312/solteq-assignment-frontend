import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AverageMonthsSalaryStatistics, EmployeesStatistics } from '@app/home/models/statistics-models';
import { StatisticsService } from '@app/home/statistics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean;
  statsDataGraphRaw: AverageMonthsSalaryStatistics;
  statsDataGraphFormatted: any[];
  employeesStats: EmployeesStatistics;

  currentGraphYear: number;
  availableYears: number[] = [2017, 2018];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Average salary';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private route: ActivatedRoute, private statsService: StatisticsService) {
    this.statsDataGraphRaw = <AverageMonthsSalaryStatistics>this.route.snapshot.data.stats;
    this.statsService.getEmployeesStatistics().subscribe(data => {
      this.employeesStats = data;
    });
    const objs: any[] = [];

    this.statsDataGraphRaw.data.filter(x => x.year === 2018).forEach(x => {
      objs.push({
        name: x.monthName,
        value: x.amount
      });
    });
    this.statsDataGraphFormatted = [
      {
        name: 'Average salary',
        series: objs
      }
    ];
    this.currentGraphYear = 2018;
  }

  ngOnInit() {}

  onChangeGraph(year: any) {
    if (year === this.currentGraphYear) {
      return;
    }
    const objs: any[] = [];
    this.statsDataGraphRaw.data.filter(x => x.year === year).forEach(x => {
      objs.push({
        name: x.monthName,
        value: x.amount
      });
    });
    this.statsDataGraphFormatted = [
      {
        name: 'Average salary',
        series: objs
      }
    ];
    this.currentGraphYear = year;
  }
}
