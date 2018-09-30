export interface EmployeeDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  positionsNames: string[];
  address: Address;
  salary: Salary;
}

export interface Address {
  id: number;
  street: string;
  zip: string;
  country: string;
  city: string;
}

export interface Salary {
  fromDate: string;
  toDate: string;
  amount: number;
}
