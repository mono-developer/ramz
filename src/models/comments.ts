export interface Comments {
  Status: boolean;
  Message: string;
  Result?: (ResultEntity)[] | null;
}
export class ResultEntity {
  Comment: string;
  UserPhoto: string;
  CompanyLogo: string;
  CreatedAt: string;
  UserName: string;
  Photo: string;
  CompanyName: string;
}
