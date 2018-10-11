import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageModel } from '@app/employees/models/page.model';
import { SearchResultsResponse } from '@app/employees/models/search-results.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { publishLast, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchEmployeesService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Gets paged data from server.
   * @param pageModel Page model object
   * @param searchTerm Optional string to search
   */

  getPagedEmployeesData(pageModel: PageModel, searchTerm?: string): Observable<SearchResultsResponse> {
    const pageNumber = !!pageModel.pageNumber ? pageModel.pageNumber : 0;
    let searchParams = new HttpParams()
      .set('take', pageModel.pageSize.toString())
      .set('skip', (pageModel.pageSize * pageNumber).toString());
    if (searchTerm) {
      searchParams = searchParams.append('q', searchTerm);
    }
    if (pageModel.orderBy) {
      searchParams = searchParams.append('orderby', pageModel.orderBy);
    }

    return this.httpClient.cache().get<SearchResultsResponse>('/employees/search', { params: searchParams });
  }

  /**
   * Executes search on employees tables
   * @param searchTerm String to find
   * @return {Observable<SearchResultsResponse>} The list of matched rows
   */

  searchEmployees(searchTerm: string): Observable<SearchResultsResponse> {
    const searchParams = new HttpParams().set('q', searchTerm).set('take', '25');

    return this.httpClient
      .cache()
      .get<SearchResultsResponse>('/employees/search', { params: searchParams })
      .pipe(
        publishLast(),
        refCount()
      );
  }
}
