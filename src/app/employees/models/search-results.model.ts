export interface SearchResultsResponse {
  searchResults: EmployeeSearchResultModel[];
  totalCount: number;
}

export interface EmployeeSearchResultModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  currentSalary: number;
  positionsNames: string;
}
