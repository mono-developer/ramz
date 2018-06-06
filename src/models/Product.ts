export class ProductResponse {
  Status: boolean;
  Message: string;
  Result: Result;
}
export class Result {
  CompanyInfo: CompanyInfo;
  Items?: (ItemsEntity)[] | null;
}
export class CompanyInfo {
  CompanyId: string;
  Logo: string;
  Banner: string;
  CompnayName: string;
  BusinesTitle: string;
  Mobile: string;
  FaceBook: string;
  Twitter: string;
  Instagram: string;
  Rating: string;
  CategoryEnglish: string;
  TotalViewed: string = "0";
}
export class ItemsEntity {
  BusinessProfileId: string;
  CompanyId: string;
  Price: string;
  ItemPath: string;
  ItemTitle: string;
  ItemDescription: string;
  favorite: boolean;
}
