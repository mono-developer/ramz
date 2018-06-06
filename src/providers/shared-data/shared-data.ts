// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
import { ConfigProvider } from "../config/config";
import { Events, Platform, ToastController } from "ionic-angular";
import { LoadingProvider } from "../loading/loading";
import { Device } from "@ionic-native/device";
import { TranslateService } from "@ngx-translate/core";
import { AppVersion } from "@ionic-native/app-version";
import { HttpClient } from "@angular/common/http";
import { Packages } from "../../models/packages";
// import { HttpClient } from '@angular/common/http';

@Injectable()
export class SharedDataProvider {
  public isAuthenticated: boolean = false;
  public banners;
  public tab1: any;
  public tab2: any;
  public tab3: any;
  public categories = new Array();
  public packages = new Array();
  public allCategories = new Array();
  public subCategories = new Array();
  public customerData: { [k: string]: any } = {};
  public customerType: String;
  public recentViewedProducts = new Array();
  public cartProducts = new Array();
  public privacyPolicy;
  public termServices;
  public refundPolicy;
  public aboutUs;
  public cartquantity;
  public wishList = new Array();
  public tempdata: { [k: string]: any } = {};
  public dir = "ltr";
  public selectedFooterPage = "Home5Page";
  public isCompany: boolean = false;
  public isActive: boolean = false;
  public isAndroid: boolean = false;
  public isIOS: boolean = false;
  public orderDetails = {
    tax_zone_id: "",
    delivery_firstname: "",
    delivery_lastname: "",
    delivery_state: "",
    delivery_city: "",
    delivery_postcode: "",
    delivery_zone: "",
    delivery_country: "",
    delivery_country_id: "",
    delivery_street_address: "",
    delivery_country_code: "",

    billing_firstname: "",
    billing_lastname: "",
    billing_state: "",
    billing_city: "",
    billing_postcode: "",
    billing_zone: "",
    billing_country: "",
    billing_country_id: "",
    billing_street_address: "",
    billing_country_code: "",
    total_tax: "",
    shipping_cost: "",
    shipping_method: "",
    payment_method: "",
    comments: ""
  };
  public token: string = null;
  private headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });
  constructor(
    public config: ConfigProvider,
    public http: Http,
    public http2: HttpClient,
    private storage: Storage,
    public loading: LoadingProvider,
    public events: Events,
    public translate: TranslateService,
    public platform: Platform,
    private device: Device,
    private appVersion: AppVersion,
    public toastCtrl: ToastController //private fb: Facebook,
  ) {
    let deviceType: string;
    if (this.platform.is("ios")) {
      deviceType = "2";
    } else if (this.platform.is("android")) {
      deviceType = "1";
    } else if (this.platform.is("windows")) {
      deviceType = "3";
    }
    this.config.deviceType = deviceType;
    this.storage.get("isLogged").then(val => {
      if (val == undefined) {
        this.isAuthenticated = false;
      } else if (val != undefined && val == true) {
        this.isAuthenticated = true;
      }
    });

    this.storage.get("customerData").then(data => {
      if (data != null)
        this.customerData = {
          customers_id: data.customers_id,
          customers_firstname: data.customers_firstname,
          customers_lastname: data.customers_lastname || "",
          customers_email_address: data.customers_email_address,
          customers_password: data.customers_password || "",
          customers_telephone: data.customers_telephone,
          customers_governorate: data.customers_governorate || "",
          customers_city: data.customers_city,
          customers_age: data.customers_age,
          customers_picture: data.customers_picture,
          customers_device_type: data.customers_device_type,
          customers_token: data.customers_token,
          customers_notification: data.customers_notification,

          customers_address: data.customers_address || "",
          customers_category_id: data.customers_category_id || "",
          customers_package_id: data.customers_package_id || "",
          customers_commercial_record: data.customers_commercial_record || "",
          customers_busines_title: data.customers_busines_title || "",
          customers_owner_name: data.customers_owner_name || "",
          customers_banner: data.customers_banner || "",
          customers_faceBook: data.customers_faceBook || "",
          customers_twitter: data.customers_twitter || "",
          customers_instagram: data.customers_instagram || "",
          customers_description: data.customers_description || "",
          customers_total__viewed: data.customers_total__viewed || "",
          customers_is_active: data.customers_is_active || "",
          customers_package_expires: data.customers_package_expires || "",
          customers_created_at: data.customers_created_at || "",
          isActive: data.isActive,
          Latitude: data.Latitude || "",
          Longitude: data.Longitude || ""
        };
      else this.customerData = {};
    });

    this.storage.get("customerType").then(val => {
      // console.log("Shared customerType: " + val)
      if (val == undefined || val == false) {
        this.customerType = "user";
        storage.set("customerType", "user");
      } else {
        this.customerType = val;
      }
    });

    //getting all allCategories
    this.http2
      .get<CategoryResponse>(config.url + "category/main")
      .subscribe(data => {
        this.categories = data.Result;
        this.loading.hide();
      });

    this.http2.get<Packages>(config.url + "package/all").subscribe(data => {
      this.packages = data.Result;
      this.loading.hide();
    });

    //getting all allCategories
    let headers_ = new Headers({
      "X-API-KEY": "1b41924f23b544e8dc9dd2cbe2328ba0"
    });
    let options = new RequestOptions({ headers: headers_ });
    // this.http2.get<CategoryResponse>(config.url + 'category/main').subscribe(data => {
    //   this.categories=data.Result
    //   console.log(data);
    // });

    //getting all allCategories
    this.http2
      .get<CategoryResponse>(config.url + config.allcategory)
      .subscribe(data => {
        this.allCategories = data.Result;
        // console.log(data);
      });
  }

  login(data) {
    this.customerData = data;
    this.storage.set("customerData", this.customerData);
  }

  logOut() {
    this.loading.autoHide(500);
    this.customerData = {};
    this.storage.clear().then(data => {
    });
    this.storage.set("isLogged", false);
    this.storage.set("customerData", this.customerData);
    this.events.publish("user:logout", Date.now());
    // this.fb.logout();
  }

  //============================================================================================
  //registering device for push notification function
  registerDevice(userId: string) {
    //this.storage.get('registrationId').then((registrationId) => {

    // console.log("app customerType: " + val)
    let formData: FormData = new FormData();
    if (this.isCompany) formData.append("companyid", userId);
    else formData.append("userid", userId);
    let deviceType: string;
    if (this.platform.is("ios")) {
      deviceType = "2";
    } else if (this.platform.is("android")) {
      deviceType = "1";
    } else if (this.platform.is("windows")) {
      deviceType = "3";
    }
    this.config.deviceType = deviceType;
    formData.append("devicetype", deviceType);
    formData.append("token", this.token);
    let url =
      this.isCompany == false
        ? this.config.userRefreshToken
        : this.config.CompanyRefreshToken;
    this.http
      .post(this.config.url + url, formData, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => { }, error => { });
  }

  showAd() {
    this.loading.autoHide(2000);
    this.events.publish("showAd");
  }

  setCompanyFlag(type: string) {
    this.storage.get("customerType").then(val => {
      // console.log("app customerType: " + val)
      this.storage.set("customerType", type);
    });
    if (type != null && type != undefined && type == "company") {
      this.isCompany = true;
    } else {
      this.isCompany = false;
    }
  }

  setCompanyStatus(active: string) {
    this.storage.get("isActive").then(val => {
      // console.log("app customerType: " + val)

      if (active != null && active != undefined && active == "1") {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
      this.storage.set("isActive", active);
    });
  }

  showToast(
    message: string,
    duration: number,
    position: string,
    cssClass: string,
    fn
  ) {
    let toast = this.toastCtrl.create({
      message: this.translate.instant(message),
      duration: duration, //3000
      cssClass: cssClass,
      position: position //'top', "middle", "bottom"
    });

    toast.onDidDismiss(fn);

    toast.present(toast);
  }

  isVideo(path: string): boolean {
    let map = new Map()
      .set("MOV", "MOV")
      .set("MP4", "MP4")
      .set("M4A", "M4A")
      .set("3GP", "3GP");
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(path)[1];
    if (map.has(ext.trim().toUpperCase() + "")) {
      return true;
    } else {
      return false;
    }
  }
}
