import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { DashboardBlockComponent } from './dashboard-block/dashboard-block.component';
import { StatisticsService } from '@app/home/statistics.service';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, HomeRoutingModule, NgxChartsModule],
  declarations: [HomeComponent, DashboardBlockComponent],
  providers: [QuoteService, StatisticsService]
})
export class HomeModule {}
