export interface CompanyState {
  Status: boolean;
  Message: string;
  Result: Result;
}
export interface Result {
  WeekAgo: string;
  MonthAgo: string;
  YearAgo: string;
}
