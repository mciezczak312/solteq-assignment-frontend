import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { EmployeesListComponent } from '@app/employees/employees-list/employees-list.component';
import { EmployeeFormComponent } from '@app/employees/employee-form/employee-form.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'employees', component: EmployeesListComponent, data: { title: extract('Employees') } },
    { path: 'employees/:id', component: EmployeeFormComponent, data: { title: extract('Employee form') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EmployeesRoutingModule {}
