// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavParams,
  ToastController,
  Platform
} from "ionic-angular";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { TranslateService } from "@ngx-translate/core";
import { LoadDataProvider } from "../../providers/load-data/load-data";
import { Http, Headers } from "@angular/http";
import { ConfigProvider } from "../../providers/config/config";
import { HttpClient } from "@angular/common/http";
import { LoadingProvider } from "../../providers/loading/loading";
import { Status } from "../../models/status";
import { CompanyInfo, ItemsEntity } from "../../models/Product";
import { DatePicker } from "@ionic-native/date-picker";

@IonicPage({
  priority: "high"
  // segment: `home-page`
})
@Component({
  selector: "new-order",
  templateUrl: "new-order.html"
})
export class NewOrderPage {
  data = {
    title: "",
    pricefrom: "",
    priceto: "",
    deliveryday: "",
    deliverymonth: "",
    userid: "",
    governorateid: "",
    cityid: "",
    categoryid: "",
    mobile: "",
    comments: " ",
    companyid: ""
  };
  date: any = new Date();
  companyInfo: CompanyInfo;
  langId: number;
  count: number = 1;
  governorates: any;
  categories: any;
  cities: any;
  headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });
  constructor(
    private datePicker: DatePicker,
    public viewCtrl: ViewController,
    loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public http: Http,
    public shared: SharedDataProvider,
    public http2: HttpClient,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public platform: Platform,
    translate: TranslateService
  ) {
    let date = new Date();
    this.date = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getFullYear().toString();
    this.data.deliveryday = date.getDate().toString();
    this.data.deliverymonth = (date.getMonth() + 1).toString();
    this.langId = localStorage.langId;

    this.companyInfo = this.navParams.get("companyInfo");
    console.log(this.companyInfo);
    if (this.companyInfo) {
      let companyInfo: any = this.companyInfo;
      this.data.companyid = companyInfo.CompanyId;
      this.data.categoryid = companyInfo.CategoryId;
    } else {
      loadDataProvider.getCategories().then(
        data => {
          this.categories = data;
        },
        err => console.log(err)
      );
    }

    loadDataProvider.getGovernorates().then(
      data => {
        this.governorates = data;
      },
      err => console.log(err)
    );

    let request = this.navParams.get("request");

    if (request != undefined && request) this.getRequestInfo(request.RequestId);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getCities(goverId) {
    this.http
      .get(this.config.url + this.config.getCities + goverId, {
        headers: this.headers
      })
      .map(res => res.json())
      .subscribe(data => {
        this.cities = data.Result;
      });
  }


  changed(item) {
    console.log(item);
    this.data.categoryid = item;
  }

  save() {

    console.log(this.data, this.config.url, this.config.saveRequest);
    let formData: FormData = new FormData();

    formData.append("userid", this.shared.customerData.customers_id);
    formData.append("title", this.data.title);
    // formData.append("governorateid", this.data.governorateid);
    formData.append("cityid", this.data.cityid);
    formData.append("categoryid", this.data.categoryid);
    formData.append("pricefrom", this.data.pricefrom);
    formData.append("priceto", this.data.priceto);
    formData.append("deliveryday", this.data.deliveryday);
    formData.append("deliverymonth", this.data.deliverymonth);
    formData.append("mobile", this.data.mobile);

    if (this.companyInfo) {
      formData.append("companyid", this.data.companyid);
    }

    if (this.data.comments)
      formData.append("comments", this.data.comments);
    else formData.append("comments", "  ");

    this.loading.show();
    this.http2
      .post<Status>(this.config.url + this.config.newOrder, formData)
      .subscribe(
        data => {
          if (data.Status) {
            this.loading.hide();
            this.shared.showToast(
              "Your request has been sent successfully",
              3000,
              "bottom",
              "success",
              () => {
                this.dismiss();
              }
            );
          }
        },
        error => {
          this.loading.hide();
          var errMsg = "";
          errMsg = "Request order failed.";
          this.shared.showToast(errMsg, 3000, "bottom", "error", () => {
            // this.dismiss();
          });
          // console.log("error: " + error)
          // console.log("errMsg1: " + JSON.parse(error._body).Message)
          // errMsg += JSON.parse(error._body).Message;
          // console.log("errMsg2: " + errMsg)
        }
      );
  }

  getRequestInfo(requestId) {
    this.loading.show();
    this.http
      .get(this.config.url + this.config.getRequestInfo + requestId, {
        headers: this.headers
      })
      .map(res => res.json())
      .subscribe(
        data => {
          this.loading.hide();
          if (data.Status == true) {
            console.log(this.data);
            this.data.pricefrom = data.Result.PriceFrom;
            this.data.priceto = data.Result.PriceTo;
            this.data.deliveryday = data.Result.DeliveryDay;
            this.data.deliverymonth = data.Result.DeliveryMonth;
            this.data.mobile = data.Result.Mobile;
            this.data.comments = data.Result.Description;
          } else if (data.Status == false) {
            this.shared.showToast(
              data.Message,
              3000,
              "bottom",
              "error",
              () => { }
            );
          }
        },
        error => {
          this.loading.hide();
          var errMsg = "Error while Loading request info!";
          if (error.status == 403) {
            errMsg += "\n" + JSON.parse(error._body).error;
          } else if (error.status == 400) {
            errMsg += "\n" + JSON.parse(error._body).Message;
          }
          this.shared.showToast(errMsg, 3000, "bottom", "error", () => { });
        }
      );
  }

  showDateTimePicker() {
    this.datePicker
      .show({
        date: this.getNowAndAdd(0, true),
        minDate: this.getNowAndAdd(0),
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
      })
      .then(
        date => {
          console.log(date.getDate().toString());
          if (date != null) {
            this.date =
              date.getDate().toString() +
              "/" +
              (date.getMonth() + 1).toString() +
              "/" +
              date.getFullYear().toString();
            this.data.deliveryday = date.getDate().toString();
            this.data.deliverymonth = (date.getMonth() + 1).toString();
          }
        },
        err => console.log("Error occurred while getting data: ", err)
      );
  }
  minus() {
    this.count--;
    if (this.count == 0) {
      this.count = 1;
    }
  }

  plus() {
    this.count++;
  }
  private getNowAndAdd(nbDays, forceDate = false): any {
    var date = new Date(new Date().getTime() + nbDays * 24 * 3600 * 1000);

    return this.platform.is("android") && !forceDate ? date.getTime() : date;
  }
}
