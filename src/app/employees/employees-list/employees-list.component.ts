import { Component, OnInit } from '@angular/core';
import { SearchEmployeesService } from '@app/employees/search-employees.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private searchService: SearchEmployeesService) {}

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.searchService.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          map(result => {
            this.searchResults = result;
            return this.composeOptions(result);
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  ngOnInit() {}

  itemSelected(event: NgbTypeaheadSelectItemEvent) {
    console.log(event);
    console.log(this.searchResults);
  }

  composeOptions(result: any) {
    const options: string[] = [];
    result.forEach((x: any) => {
      options.push(x.firstName);
      options.push(x.lastName);
      options.push(x.email);
    });
  }
}
