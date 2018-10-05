import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { EmployeesListComponent } from '@app/employees/employees-list/employees-list.component';
import { EmployeeFormComponent } from '@app/employees/employee-form/employee-form.component';
import { EmployeeResolver } from '@app/employees/resolvers/employee.resolver';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'employees', component: EmployeesListComponent, data: { title: extract('Employees') } },
    {
      path: 'employees/:id',

      component: EmployeeFormComponent,
      data: { title: extract('Employee form'), reuse: false },
      resolve: {
        employee: EmployeeResolver
      }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EmployeesRoutingModule {}
