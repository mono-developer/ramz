export interface CompanyLatest {
  Status: boolean;
  Message: string;
  Result?: (ResultEntity)[] | null;
}
export interface ResultEntity {
  CompanyId: string;
  Logo: string;
  CompnayName: string;
  BusinesTitle: string;
  TotalViewed: string;
}
