export class Packages {
  Status: boolean;
  Message: string;
  Result?: (Pkg)[] | null;
}
export class Pkg {
  PackageId: string;
  PackageName: string;
  SubscriptionPrice: string;
  PublishingPercentage: string;
  DeliveryRatio: string;
  ExcellenceRatio: string;
  ColorBg: string;
  IsFree: string;
  OfferDays: string;
}
