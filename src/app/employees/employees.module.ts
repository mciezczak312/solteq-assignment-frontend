import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeesRoutingModule } from '@app/employees/employees-routing.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    EmployeesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgbModule
  ],
  declarations: [EmployeesListComponent, EmployeeFormComponent]
})
export class EmployeesModule {}
