
import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  ViewController
} from "ionic-angular";
import { ConfigProvider } from "../../providers/config/config";
import { Http, Headers } from "@angular/http";
import { LoadingProvider } from "../../providers/loading/loading";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { CommentsPage } from "../comments/comments";
import { Storage } from "@ionic/storage";
import { ProductDetailPage } from "../product-detail/product-detail";
import { ProductsPage } from "../products/products";

@Component({
  selector: "page-fav",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "fav.html"
})
export class FavPage {
  requests = [];
  companies = [];
  private headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });

  constructor(
    private ref: ChangeDetectorRef,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public toastCtrl: ToastController,
    public storage: Storage,
    public navCtrl: NavController,
    public viewCtrl: ViewController
  ) { }

  ionViewWillEnter() {
    this.requests = [];
    this.companies = [];
    this.storage.forEach((index, key, value) => {
      if (key.search("product") >= 0) {
        this.storage.get(key).then(val => {
          this.requests.push(val);
          this.ref.detectChanges();
        });
      } else if (key.search("company") >= 0) {
        this.storage.get(key).then(val => {
          this.companies.push(val);
          this.ref.detectChanges();
        });
      }
    });
  }
  removeFav(type, obj, index) {
    // console.log("index: " + index)
    if (type == "product") {
      this.storage
        .get("product " + obj.BusinessProfileId)
        .then(value => {
          if (value && JSON.stringify(value) != null) {
            this.storage.remove("product " + obj.BusinessProfileId);
            this.requests.splice(index, 1);
            this.ref.detectChanges();
          }
        })
        .catch(() => (obj.favorite = false));
    } else if (type == "company") {
      this.storage
        .get(
          `company ${obj.CategoryId} ${obj.CompanyId} ${obj.AgeFrom} ${
          obj.AgeTo
          }`
        )
        .then(value => {
          if (value && JSON.stringify(value) != null) {
            this.storage.remove(
              `company ${obj.CategoryId} ${obj.objId} ${obj.AgeFrom} ${
              obj.AgeTo
              }`
            );
            this.companies.splice(index, 1);
            this.ref.detectChanges();
          }
        })
        .catch(() => (obj.favorite = false));
    }
  }

  openProductDetails(c) {
    // console.log('openSharePage companyInfo' + JSON.stringify(c));
    this.navCtrl.push(ProductDetailPage, { data: c });
  }

  openCompanyDetails(c) {
    // console.log('openSharePage companyInfo' + JSON.stringify(c));
    this.navCtrl.push(ProductsPage, { companyId: c });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
