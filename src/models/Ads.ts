export class Ads {
  Status: boolean;
  Message: string;
  Result?: (ResultEntity)[] | null;
}
export class ResultEntity {
  AdvId: string;
  Mobile: string;
  Url: string;
  Banner: string;
  InSeconds: string;
  Repeats: string;
  IsVisible: string;
  Notes: string;
  CreatedAt: string;
}
