export interface AverageMonthsSalaryStatistics {
  data: [
    {
      monthName: string;
      amount: number;
      year: number;
    }
  ];

  timeStamp: string;
}

export interface EmployeesStatistics {
  averageCurrentSalary: number;
  employeesCount: number;
}
