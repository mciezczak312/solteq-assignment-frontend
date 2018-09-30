import { Component, OnInit } from '@angular/core';
import { SearchEmployeesService } from '@app/employees/search-employees.service';
import { catchError, debounceTime, distinctUntilChanged, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { PageModel } from '@app/employees/models/page.model';
import { EmployeeSearchResultModel, SearchResultsResponse } from '@app/employees/models/search-results.model';
import { Router } from '@angular/router';
import { EmployeesService } from '@app/employees/employees.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  model: any;
  searching = false;
  searchFailed = false;
  searchResults: any = [];

  page = new PageModel();
  rows: any;
  loading: boolean;
  selectedRow: EmployeeSearchResultModel[] = [];

  constructor(
    private employeeService: EmployeesService,
    private searchService: SearchEmployeesService,
    private router: Router) {

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
    this.employeeService.deleteEmployee(emplId).subscribe(x => {
      console.log(x);
    });
  }

  itemSelected(event: NgbTypeaheadSelectItemEvent) {
    const option = event.item;
    this.searchService.searchEmployees(option)
      .subscribe((data: SearchResultsResponse) => {
        this.rows = data.searchResults;
        this.page.pageNumber = 0;
        this.page.totalElements = data.totalCount;
      });
  }

  onRowSelect({ selected }: any) {
    console.log(selected);

    this.selectedRow.splice(0, this.selectedRow.length);
    this.selectedRow.push(...selected);
  }

  setPage(pageInfo: any) {
    this.page.pageNumber = pageInfo.offset;
    this.loading = true;
    this.searchService.getPagedEmployeesData(this.page).subscribe((pagedData: SearchResultsResponse) => {
      this.page.totalElements = pagedData.totalCount;

      this.rows = pagedData.searchResults;
      this.loading = false;
    });
  }


  private composeOptions(result: EmployeeSearchResultModel[], searchTerm: string) {
    const options: string[] = [];
    result.forEach((x: EmployeeSearchResultModel) => {
      const termUpper = searchTerm.toLocaleUpperCase();
      if (x.firstName.toLocaleUpperCase().indexOf(termUpper) !== -1) {
        options.push(x.firstName);
      }
      if (x.lastName.toLocaleUpperCase().indexOf(termUpper) !== -1) {
        options.push(x.lastName);
      }
      if (x.email.toLocaleUpperCase().indexOf(termUpper) !== -1) {
        options.push(x.email);
      }
    });
    return options;
  }
}
