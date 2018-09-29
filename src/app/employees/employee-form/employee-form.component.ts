import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  positions: any;

  constructor(private formBuilder: FormBuilder) {}

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

    this.positions = [
      {
        id: 1,
        name: 'CEO'
      }
    ];
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
      zipCode: ['', Validators.required],
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
