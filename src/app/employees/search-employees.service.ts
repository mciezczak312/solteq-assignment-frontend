import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PageModel } from '@app/employees/models/page.model';
import { SearchResultsResponse } from '@app/employees/models/search-results.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchEmployeesService {
  constructor(private httpClient: HttpClient) {}

  getPagedEmployeesData(pageModel: PageModel): Observable<SearchResultsResponse> {
    const searchParams = new HttpParams()
      .set('take', pageModel.pageSize.toString())
      .set('skip', (pageModel.pageSize * pageModel.pageNumber).toString());

    return this.httpClient.cache().get<SearchResultsResponse>('/employees/search', { params: searchParams });
  }

  searchEmployees(searchTerm: string): Observable<SearchResultsResponse> {
    const searchParams = new HttpParams().set('q', searchTerm).set('take', '5');

    return this.httpClient.cache().get<SearchResultsResponse>('/employees/search', { params: searchParams });
  }
}
