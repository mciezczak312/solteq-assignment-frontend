import { TestBed } from '@angular/core/testing';

import { SearchEmployeesService } from './search-employees.service';

describe('SearchEmployeesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    expect(service).toBeTruthy();
  });
});
