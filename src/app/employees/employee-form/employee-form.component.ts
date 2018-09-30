import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesService } from '@app/employees/employees.service';
import { Position } from '@app/employees/models/position';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeDto } from '@app/employees/models/employee-dto.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  positions: Position[];
  employeeId: number;

  constructor(
    private formBuilder: FormBuilder,
    public employeeService: EmployeesService,
    private route: ActivatedRoute
  ) {}

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
    this.employeeService.getPositionsDictionary().subscribe(x => (this.positions = x));
    this.employeeId = this.route.snapshot.params.id;
    if (this.employeeId !== 0) {
      this.employeeService.getEmployeeById(this.employeeId).subscribe((data: EmployeeDto) => {
        this.employeeForm.patchValue(data);
      });
    }
  }

  get addressGroup(): any {
    return this.employeeForm.controls.address;
  }

  get salaryGroup(): any {
    return this.employeeForm.controls.salary;
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
    return this.formBuilder.group({
      amount: [null, [Validators.min(0.0), Validators.required]],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }
}
