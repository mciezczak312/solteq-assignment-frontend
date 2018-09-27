export interface SalaryInterval {
  name: string;
  value: number;
}

export interface EmployeesStatisticsModel {
  salaryIntervals: SalaryInterval[];
  avgSalary: number;
  employeesCount: number;
  timeStamp: string;
}
