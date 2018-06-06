// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Storage } from "@ionic/storage";
import { Platform } from "ionic-angular";
// import { OneSignal } from "@ionic-native/onesignal";

@Injectable()
export class ConfigProvider {
  public url: string = "https://almumaiaz.com/ramzrest/";
  public userImageURL: string = "https://almumaiaz.com/ramzrest/uploads/user_uploads/";
  public companyImageURL: string = "https://almumaiaz.com/ramzrest/uploads/company_uploads/";
  public backEndURL: string = "https://almumaiaz.com/ramzrest/uploads/backend_uploads/";
  public apiKeyValue = "1b41924f23b544e8dc9dd2cbe2328ba0";
  public processLogin: string = "user/login";
  public processCompanyLogin: string = "company/login";
  public processRegistration: string = "user/register";
  public processCompanyRegistration: string = "company/register";
  public updateCustomerInfo: string = "user/profiledata";
  public updateProfilePhoto: string = "user/profilephoto";
  public getCustomerInterests: string = "user/getinterests/";
  public updateCustomerInterests: string = "user/profileinterests";
  public updateProfileaddress: string = "company/profileaddress";
  public updateProfileLogo: string = "company/profilelogo";
  public updateProfileBanner: string = "company/profilebanner";
  public findCompany: string = "company/find/";
  public userUploads: string = "uploads/user_uploads/";
  public companyUploads: string = "uploads/company_uploads/";
  public processForgotPassword: string = "user/forgetpassword";
  public processCompanyForgotPassword: string = "company/forgetpassword";
  public getAllGovernorates: string = "governorate/all";
  public getCities: string = "governorate/findcity/";
  public allcategory: string = "category/all";
  public getSearchData: string = "company/search";
  public getLookupData: string = "company/lookup";
  public getNotification: string = "user/notification/";
  public getCompanyNotification: string = "company/notification/";
  public getRequests: string = "user/requests/";
  public getCompanyRequests: string = "company/requests/";
  public getRequestInfo: string = "request/info/";
  public getComments: string = "request/comments/";
  public setComment: string = "user/comment";
  public setCompanyComment: string = "company/comment";
  public saveContactus: string = "ramz/contactus";
  public saveRequest: string = "request/create";
  public newOrder: string = "user/placeorder";
  public getItemComments: string = "company/itempost/";
  public saveUserComment: string = "user/post";
  public giverating: string = "company/giverating";
  public ramzGiveRating: string = "ramz/giverating";
  public ramzRating: string = "ramz/rating";
  public getOrders: string = "user/orders/";
  public getCompanyOrders: string = "company/orders/";
  public getOrderOffers: string = "user/orderoffer/";
  public getCompanyOrderOffers: string = "company/offer/";
  public saveReplyoffer: string = "company/replyoffer";
  public addProduct: string = "company/additem";
  public creditCard: string = "payment/stripe";
  public getCommercials: string = "commercial/get/";
  public westernunion: string = "payment/westernunion";
  public advertisement: string = "advertisement/create";
  public companyStats: string = "company/stats";
  public companyLatest: string = "company/latest";
  public top10: string = "company/topten";
  public checkCompanyIsActive: string = "company/isactive/";
  public saveCompanyComment: string = "company/post";
  public setLocation: string = "company/location";
  public userRefreshToken: string = "user/refreshdevice";
  public CompanyRefreshToken: string = "company/refreshdevice";
  public updateitem: string = "company/updateitem";
  public deleteitem: string = "company/deleteitem";
  //PayPal
  public payPalEnvironment = "payPalEnvironmentSandbox";
  // public payPalEnvironment = 'payPalEnvironmentProduction';
  public payPalEnvironmentSandbox = "AafHVKDrpAN1kWtwiQyRzoJJHErv9hRomm22T0XsIIb_UssREXkxYew5zIjBAzOsuHxR2fvjYr4LZRV7";
  public payPalEnvironmentProduction = "";

  public langId: string = localStorage.langId;
  public deviceType: string;
  public langName: string = localStorage.langName;
  public loader = "dots";
  public newProductDuration = 100;
  public cartButton = 1; //1 = show and 0 = hide
  public currency = "OMR";
  public currencyPos = "right";
  public paypalCurrencySymbol = "USD";
  public address;
  public fbId;
  public email;
  public latitude;
  public longitude;
  public phoneNo;
  public lazyLoadingGif;
  public notifText;
  public notifTitle;
  public notifDuration;
  public footerShowHide;
  public homePage = 5;
  public categoryPage = 1;
  public siteUrl = "";
  public appName = "Ramz";
  public packgeName = "ramz";
  public introPage = 1;
  public myOrdersPage = 1;
  public newsPage = 1;
  public wishListPage = 1;
  public shippingAddressPage = 1;
  public aboutUsPage = 1;
  public contactUsPage = 1;
  public editProfilePage = 1;
  public settingPage = 1;
  public admob = 100;
  public admobBannerid = "";
  public admobIntid = "";
  public admobIos = 1;
  public admobBanneridIos = "";
  public admobIntidIos = "";
  public googleAnalaytics = "";
  public rateApp = 1;
  public shareApp = 1;
  public fbButton = 1;
  public googleButton = 1;
  public notificationType = "";
  public onesignalAppId = "";
  public onesignalSenderId = "";

  constructor(
    public http: Http,
    private storage: Storage,
    public platform: Platform,
    // private oneSignal: OneSignal,
    private localNotifications: LocalNotifications
  ) { }
  public siteSetting() {
    return new Promise(resolve => {
      this.http
        .get(this.url + "siteSetting")
        .map(res => res.json())
        .subscribe(data => {
          var settings = data.data[0];
          this.fbId = settings.facebook_app_id;
          this.address =
            settings.address +
            ", " +
            settings.city +
            ", " +
            settings.state +
            " " +
            settings.zip +
            ", " +
            settings.country;
          this.email = settings.contact_us_email;
          this.latitude = settings.latitude;
          this.longitude = settings.longitude;
          this.phoneNo = settings.phone_no;
          this.lazyLoadingGif = settings.lazzy_loading_effect;
          this.newProductDuration = settings.new_product_duration;
          this.notifText = settings.notification_text;
          this.notifTitle = settings.notification_title;
          this.notifDuration = settings.notification_duration;
          this.currency = settings.currency_symbol;
          this.cartButton = settings.cart_button;
          this.footerShowHide = settings.footer_button;
          this.setLocalNotification();
          this.appName = settings.app_name;
          this.homePage = settings.home_style;
          this.categoryPage = settings.category_style;
          this.siteUrl = settings.site_url;
          this.introPage = settings.intro_page;
          this.myOrdersPage = settings.my_orders_page;
          this.newsPage = settings.news_page;
          this.wishListPage = settings.wish_list_page;
          this.shippingAddressPage = settings.shipping_address_page;
          this.aboutUsPage = settings.about_us_page;
          this.contactUsPage = settings.contact_us_page;
          this.editProfilePage = settings.edit_profile_page;
          this.packgeName = settings.package_name;
          this.settingPage = settings.setting_page;
          // this.admob = settings.admob;
          this.admobBannerid = settings.ad_unit_id_banner;
          this.admobIntid = settings.ad_unit_id_interstitial;
          this.googleAnalaytics = settings.google_analytic_id;
          this.rateApp = settings.rate_app;
          this.shareApp = settings.share_app;
          this.fbButton = settings.facebook_login;
          this.googleButton = settings.google_login;
          this.notificationType = settings.default_notification;
          this.onesignalAppId = settings.onesignal_app_id;
          this.onesignalSenderId = settings.onesignal_sender_id;
          this.admobIos = settings.ios_admob;
          this.admobBanneridIos = settings.ios_ad_unit_id_banner;
          this.admobIntidIos = settings.ios_ad_unit_id_interstitial;
          resolve();
        });
    });
  }
  //Subscribe for local notification when application is start for the first time
  setLocalNotification() {
    this.platform.ready().then(() => {
      this.storage.get("localNotification").then(val => {
        if (val == undefined) {
          this.storage.set("localNotification", "localNotification");
          this.localNotifications.schedule({
            id: 1,
            title: this.notifTitle,
            text: this.notifText,
            every: this.notifDuration
          });
        }
      });
    });
  }
}
