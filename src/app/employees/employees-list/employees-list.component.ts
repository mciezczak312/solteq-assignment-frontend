import { Component, OnInit } from '@angular/core';
import { SearchEmployeesService } from '@app/employees/search-employees.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  skipWhile,
  switchMap,
  tap
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { PageModel } from '@app/employees/models/page.model';
import { EmployeeSearchResultModel, SearchResultsResponse } from '@app/employees/models/search-results.model';
import { Router } from '@angular/router';
import { EmployeesService } from '@app/employees/employees.service';
import { extract, HttpCacheService } from '@app/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  searchInputModel: any;
  searching = false;
  searchFailed = false;
  searchResults: any = [];

  page = new PageModel();
  rows: EmployeeSearchResultModel[];
  loading: boolean;
  selectedRow: EmployeeSearchResultModel[] = [];
  columnsModel = [
    { name: 'First name' },
    { name: 'Last name' },
    { name: 'Email' },
    { name: 'Current Salary' },
    { name: 'Positions names' }
  ];
  defaultSort = [{ prop: 'firstName', dir: 'asc' }];

  constructor(
    private employeeService: EmployeesService,
    private searchService: SearchEmployeesService,
    private cacheService: HttpCacheService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.page.pageNumber = 0;
    this.page.pageSize = 20;
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      skipWhile(term => term.length < 2),
      distinctUntilChanged(),
      switchMap(term => {
        this.searching = true;
        return this.searchService.searchEmployees(term).pipe(
          tap(() => (this.searchFailed = false)),
          map(result => {
            this.searchResults = result.searchResults;
            return this.composeOptions(result.searchResults, term);
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => (this.searching = false))
    );

  onEdit() {
    const emplId = this.selectedRow[0].id;
    this.router.navigate(['/employees/', emplId]);
  }

  onDelete() {
    const emplId = this.selectedRow[0].id;
    this.employeeService.deleteEmployee(emplId).subscribe(() => {
      this.rows = this.rows.filter(x => x.id !== emplId);
      this.selectedRow.pop();
      this.cacheService.cleanCache();
      this.toast.success(extract('Employee removed'));
    });
  }

  itemSelected(event: NgbTypeaheadSelectItemEvent) {
    const option = event.item;
    this.searchService.getPagedEmployeesData(this.page, option).subscribe((data: SearchResultsResponse) => {
      this.rows = data.searchResults;
      this.page.pageNumber = 0;
      this.page.totalElements = data.totalCount;
    });
  }

  onRowSelect({ selected }: any) {
    this.selectedRow.splice(0, this.selectedRow.length);
    this.selectedRow.push(...selected);
  }

  onSearch(event: any) {
    this.setPage(this.page, this.searchInputModel);
  }

  onSort(event: any) {
    this.page.pageNumber = 0;
    this.page.orderBy = event.sorts[0].prop + ';' + event.sorts[0].dir;
    this.loading = true;
    this.searchService
      .getPagedEmployeesData(this.page, this.searchInputModel)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data: SearchResultsResponse) => {
        this.rows = data.searchResults;
        this.page.totalElements = data.totalCount;
      });
  }

  setPage(pageInfo: any, searchTerm?: string) {
    this.page.pageNumber = pageInfo.offset;
    this.loading = true;
    this.searchService
      .getPagedEmployeesData(this.page, searchTerm)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((pagedData: SearchResultsResponse) => {
        this.page.totalElements = pagedData.totalCount;

        this.rows = pagedData.searchResults;
      });
  }

  private composeOptions(result: EmployeeSearchResultModel[], searchTerm: string) {
    let options: string[] = [];
    result.forEach((x: EmployeeSearchResultModel) => {
      options.push(x.firstName);
      options.push(x.lastName);
      options.push(x.email);
    });
    const termUpper = searchTerm.toLocaleUpperCase();
    options = options.filter(x => x.toLocaleUpperCase().indexOf(termUpper) !== -1);
    options = options.filter((v, i, a) => a.indexOf(v) === i);
    return options;
  }
}
