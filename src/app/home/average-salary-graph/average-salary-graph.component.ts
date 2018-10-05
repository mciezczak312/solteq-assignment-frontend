import { Component, Input, OnInit } from '@angular/core';
import { extract } from '@app/core';
import { AverageMonthsSalaryStatistics } from '@app/home/models/statistics-models';

@Component({
  selector: 'app-average-salary-graph',
  templateUrl: './average-salary-graph.component.html',
  styleUrls: ['./average-salary-graph.component.scss']
})
export class AverageSalaryGraphComponent implements OnInit {
  currentGraphYear: number;
  availableYears: number[] = [2017, 2018];

  @Input()
  statsDataGraphRaw: AverageMonthsSalaryStatistics;
  statsDataGraphFormatted: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = extract('Month');
  showYAxisLabel = true;
  yAxisLabel = extract('Average salary');

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {}

  ngOnInit() {
    this.onChangeGraph(2018);
  }

  onChangeGraph(year: any) {
    if (year === this.currentGraphYear) {
      return;
    }
    const arr: any[] = [];
    this.statsDataGraphRaw.data.filter(x => x.year === year).forEach(x => {
      arr.push({
        name: x.monthName,
        value: x.amount
      });
    });
    this.statsDataGraphFormatted = [
      {
        name: 'Average salary',
        series: arr
      }
    ];
    this.currentGraphYear = year;
  }
}
