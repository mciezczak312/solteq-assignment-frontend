import { TestBed } from '@angular/core/testing';

import { SearchEmployeesService } from './search-employees.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchEmployeesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: SearchEmployeesService = TestBed.get(SearchEmployeesService);
    expect(service).toBeTruthy();
  });
});
