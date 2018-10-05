import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { AverageMonthSalaryResolver } from './resolvers/average-month-salary.resolver';
import { EmployeesStatsResolver } from '@app/home/resolvers/employees-stats.resolver';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent,
      data: { title: extract('Home') },
      resolve: {
        avgMonthSalary: AverageMonthSalaryResolver,
        employeesStats: EmployeesStatsResolver
      }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AverageMonthSalaryResolver, EmployeesStatsResolver]
})
export class HomeRoutingModule {}
