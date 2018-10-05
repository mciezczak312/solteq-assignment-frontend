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
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CsvModule } from '@ctrl/ngx-csv';
import { MonthDatePickerComponent } from './month-date-picker/month-date-picker.component';
import { EmployeeResolver } from '@app/employees/resolvers/employee.resolver';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    EmployeesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    CsvModule,
    NgxDatatableModule,
    NgbModule
  ],
  declarations: [EmployeesListComponent, EmployeeFormComponent, MonthDatePickerComponent],
  providers: [EmployeeResolver]
})
export class EmployeesModule {}
