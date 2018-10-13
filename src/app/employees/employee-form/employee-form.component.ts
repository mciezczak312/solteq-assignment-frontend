import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesService } from '@app/employees/employees.service';
import { Position } from '@app/employees/models/position.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeDto } from '@app/employees/models/employee-dto.model';
import { ToastrService } from 'ngx-toastr';
import { extract, HttpCacheService } from '@app/core';
import { from } from 'rxjs';

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
  employeeMinSalaryDate: any;
  newSalaryAdded = false;

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
      this.buildEmployeeForm();
      if (data.employee) {
        this.employeeDto = <EmployeeDto>data.employee;
        this.employeeId = this.employeeDto.id;
      } else {
        this.employeeId = 0;
        this.salaryGroup[0].patchValue({
          toDate: { year: this.currentYear, month: this.currentMonth + 1 },
          fromDate: { year: this.currentYear, month: this.currentMonth + 1 }
        });
      }
    });
  }

  ngOnInit() {
    this.employeeFromBaseState = this.employeeForm.value;
    this.employeeService.getPositionsDictionary().subscribe(x => (this.positions = x));

    if (this.employeeDto) {
      const mappedDto = Object.assign({}, this.employeeDto, { salary: [] });
      mappedDto.salary.push(this.employeeDto.salary);
      this.employeeForm.patchValue(mappedDto);
      const toDate = new Date(this.employeeDto.salary.toDate);
      const fromDate = new Date(this.employeeDto.salary.fromDate);
      this.employeeMinSalaryDate = toDate;
      this.salaryGroup.controls[0].patchValue({
        fromDate: { year: fromDate.getFullYear(), month: fromDate.getMonth() + 1 },
        toDate: { year: toDate.getFullYear(), month: toDate.getMonth() + 1 }
      });
      this.salaryGroup.controls[0].disable();
    }
  }

  get addressGroup(): any {
    return this.employeeForm.controls.address;
  }

  get salaryGroup(): any {
    return this.employeeForm.controls.salary;
  }

  onAddSalary() {
    this.salaryGroup.push(this.buildSalaryForm());
    this.salaryGroup.controls[1].controls.fromDate.setValidators([MinStartDateValidator(this.employeeMinSalaryDate)]);
    this.newSalaryAdded = true;
  }

  onSave() {
    const newEmployee: EmployeeDto = Object.assign({}, this.employeeForm.value, { salary: {} });

    if (this.employeeId === 0) {
      // ADD NEW
      this.mapSalaryToDto(newEmployee, this.salaryGroup.controls[0].controls);

      this.employeeService.addNewEmployee(newEmployee).subscribe(id => {
        this.toastr.success(extract('New employee added'));
        this.cacheService.cleanCache();
        this.router.navigateByUrl('/employees');
      });
    } else {
      // UPDATE EXISTING
      newEmployee.id = this.employeeId;
      newEmployee.address.id = this.employeeDto.address.id;

      if (this.newSalaryAdded) {
        this.mapSalaryToDto(newEmployee, this.salaryGroup.controls[1].controls);
      }
      this.employeeService.updateEmployee(newEmployee).subscribe(() => {
        this.toastr.success(extract('Employee updated'));
        this.cacheService.cleanCache();
        this.router.navigateByUrl('/employees');
      });
    }
  }

  private mapSalaryToDto(dto: EmployeeDto, salaryControls: any): any {
    const dateFrom = salaryControls.fromDate.value;
    const dateTo = salaryControls.toDate.value;
    dto.salary.amount = salaryControls.amount.value;
    dto.salary.toDate = `${dateTo.year}-${dateTo.month}-01`;
    dto.salary.fromDate = `${dateFrom.year}-${dateFrom.month}-01`;
  }

  private buildEmployeeForm() {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: '',
      positionsNamesIds: [[]],
      address: this.buildAddressForm(),
      salary: this.formBuilder.array([this.buildSalaryForm()])
    });
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

function FromToDateValidator(group: FormGroup): { [key: string]: boolean } | null {
  if (group) {
    const fromDateValue = group.controls.fromDate.value;
    const toDateValue = group.controls.toDate.value;
    const fromDate = new Date(fromDateValue.year, fromDateValue.month, 1);
    const toDate = new Date(toDateValue.year, toDateValue.month);
    if (toDate <= fromDate) {
      return { wrongDate: true };
    }
  }

  return null;
}

function MinStartDateValidator(minSalaryDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control) {
      const fromDateValue = control.value;
      const fromDate = new Date(fromDateValue.year, fromDateValue.month - 1, 1);

      if (fromDate < minSalaryDate) {
        return { wrongMinDate: true };
      }
    }

    return null;
  };
}
