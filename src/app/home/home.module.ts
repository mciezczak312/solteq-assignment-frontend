import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DashboardBlockComponent } from './dashboard-block/dashboard-block.component';
import { StatisticsService } from '@app/home/statistics.service';
import { AverageSalaryGraphComponent } from './average-salary-graph/average-salary-graph.component';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, HomeRoutingModule, NgxChartsModule],
  declarations: [HomeComponent, DashboardBlockComponent, AverageSalaryGraphComponent],
  providers: [StatisticsService]
})
export class HomeModule {}
