import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesService } from '@app/employees/employees.service';
import { Position } from '@app/employees/models/position';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeDto } from '@app/employees/models/employee-dto.model';
import { ToastrService } from 'ngx-toastr';
import { extract, HttpCacheService } from '@app/core';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  employeeFromBaseState: any;
  positions: Position[];

  employeeId: number;
  employeeDto: EmployeeDto;

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();

  constructor(
    private formBuilder: FormBuilder,
    public employeeService: EmployeesService,
    private route: ActivatedRoute,
    private cacheService: HttpCacheService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.route.data.subscribe(data => {
      if (data.employee) {
        this.employeeDto = <EmployeeDto>data.employee;
        this.employeeId = this.employeeDto.id;
      } else {
        this.employeeId = 0;
        if (this.employeeForm) {
          this.employeeForm.reset(this.employeeFromBaseState, { emitEvent: false });
          this.salaryGroup.patchValue({
            toDate: { year: this.currentYear, month: this.currentMonth + 1 },
            fromDate: { year: this.currentYear, month: this.currentMonth + 1 }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: '',
      positionsNamesIds: [[]],
      address: this.buildAddressForm(),
      salary: this.buildSalaryForm()
    });
    this.employeeFromBaseState = this.employeeForm.value;
    this.employeeService.getPositionsDictionary().subscribe(x => (this.positions = x));

    if (this.employeeDto) {
      this.employeeForm.patchValue(this.employeeDto);
      const dateFrom = new Date(this.employeeDto.salary.fromDate);
      const dateTo = new Date(this.employeeDto.salary.toDate);
      this.salaryGroup.patchValue({
        toDate: { year: dateTo.getFullYear(), month: dateTo.getMonth() + 1 },
        fromDate: { year: dateFrom.getFullYear(), month: dateFrom.getMonth() + 1 }
      });
    }
  }

  get addressGroup(): any {
    return this.employeeForm.controls.address;
  }

  get salaryGroup(): any {
    return this.employeeForm.controls.salary;
  }



  onSave() {
    const newEmployee: EmployeeDto = this.employeeForm.value;
    const dateFrom = this.salaryGroup.controls.fromDate.value;
    const dateTo = this.salaryGroup.controls.toDate.value;
    newEmployee.salary.toDate = `${dateTo.year}-${dateTo.month}-01`;
    newEmployee.salary.fromDate = `${dateFrom.year}-${dateFrom.month}-01`;
    if (this.employeeId === 0) {
      this.employeeService.addNewEmployee(newEmployee).subscribe(id => {
        this.toastr.success(extract('New employee added'));
        this.cacheService.cleanCache();
        this.router.navigateByUrl('/employees');
      });
    } else {
      // UPDATE
      console.log('update');
    }
  }

  private buildAddressForm(): FormGroup {
    return this.formBuilder.group({
      street: ['', Validators.required],
      zip: ['', Validators.required],
      country: [''],
      city: ['', Validators.required]
    });
  }

  private buildSalaryForm(): FormGroup {
    return this.formBuilder.group(
      {
        amount: [null, [Validators.min(0.0), Validators.required]],
        fromDate: { year: this.currentYear, month: this.currentMonth },
        toDate: [{ year: this.currentYear, month: this.currentMonth }]
      },
      { validator: FromToDateValidator }
    );
  }
}

function FromToDateValidator(group: FormGroup): any {
  if (group) {
    const fromDateValue = group.controls.fromDate.value;
    const toDateValue = group.controls.toDate.value;
    const fromDate = new Date(fromDateValue.year, fromDateValue.month, 1);
    const toDate = new Date(toDateValue.year, toDateValue.month);
    if (toDate < fromDate) {
      return { wrongDate: true };
    }
  }

  return null;
}
