import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchEmployeesService {
  constructor() {}

  search(searchTerm: string) {
    return of([
      {
        id: 1,
        firstName: 'Name',
        lastName: 'Last name',
        email: 'Hahah',
        position: 'CEO',
        currentSalary: 3232.32
      },
      {
        id: 2,
        firstName: 'Name2',
        lastName: 'Last name2',
        email: 'Hahah2',
        position: 'CEO2',
        currentSalary: 3232.32
      }
    ]);
  }
}
