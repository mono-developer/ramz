
import { Component, ViewChild } from "@angular/core";
import {
  Nav,
  Platform,
  ModalController,
  Events,
  App,
  AlertController
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Storage } from "@ionic/storage";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
// import { HomePage } from '../pages/home/home';
import { LanguagePage } from "../pages/language/language";
import { IntroPage } from "../pages/intro/intro";
import { ContactUsPage } from "../pages/contact-us/contact-us";
import { AboutUsPage } from "../pages/about-us/about-us";
import { SignUpPage } from "../pages/sign-up/sign-up";
import { LoginPage } from "../pages/login/login";
import { ConfigProvider } from "../providers/config/config";
import { SharedDataProvider } from "../providers/shared-data/shared-data";
import { MyAccountPage } from "../pages/my-account/my-account";
import { MyOrdersPage } from "../pages/my-orders/my-orders";
import { NewsPage } from "../pages/news/news";
import { ProductsPage } from "../pages/products/products";
import { SettingsPage } from "../pages/settings/settings";
import { Network } from "@ionic-native/network";
import { AlertProvider } from "../providers/alert/alert";
import { LoadingProvider } from "../providers/loading/loading";
import { trigger, transition, animate, style } from "@angular/animations";
import { AppVersion } from "@ionic-native/app-version";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Http, Headers } from "@angular/http";
import { DiscoverPage } from "../pages/discover/discover";
import { RamzPage } from "../pages/ramz/ramz";
import { NotificationPage } from "../pages/notification/notification";
import { RequestsPage } from "../pages/requests/requests";
import { FavPage } from "../pages/fav/fav";
import { CompanyAccountPage } from "../pages/company-account/company-account";
import { SetupPage } from "../pages/setup/setup";
import { OrdersPage } from "../pages/orders/orders";
import { CommercialsPage } from "../pages/commercials/commercials";
import { Top10Page } from "../pages/top10/top10";
import { RamzRatingPage } from "../pages/ramz-rating/ramz-rating";
import { Home5Page } from "../pages/home5/home5";
import { GreatingPage } from "../pages/greating/greating";
import { PackagesPage } from "../pages/packages/packages";

@Component({
  animations: [
    trigger("animate", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("500ms", style({ opacity: 1 }))
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate("500ms", style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  homeList = false;
  homeListIcon = "add";
  categoriesList = false;
  categoriesListIcon = "add";
  shopList = false;
  shopListIcon = "add";
  customerType = this.shared.customerType;
  private headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });
  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private translate: TranslateService,
    public storage: Storage,
    public shared: SharedDataProvider,
    public http: Http,
    public config: ConfigProvider,
    public network: Network,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public events: Events,
    public plt: Platform,
    private appVersion: AppVersion,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public app: App,
    public alertCtrl: AlertController
  ) {
    if (this.platform.is("ios")) {
      shared.isIOS = true;
    } else if (this.platform.is("android")) {
      shared.isAndroid = true;
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.statusBar.styleDefault();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
    });

    // this.handleBackButton();
    storage.get("customerType").then(val => {
      // console.log("app customerType: " + val)
      if (val != null && val != undefined && val == "company") {
        this.shared.isCompany = true;
      } else {
        this.shared.isCompany = false;
      }
      if (val == undefined || val == false) {
        this.customerType = "user";
        storage.set("customerType", "user");
      } else {
        this.customerType = val;
      }
    });

    // if (localStorage.langId == undefined) {
    //   localStorage.langId = '2';
    // }
    // if (localStorage.direction == undefined) {
    //   localStorage.direction = 'ltr';
    // }

    //open intro page on start
    storage.get("isLogged").then(val => {
      if (val == undefined || val == false) {
        storage.set("isLogged", false);
        // console.log("app langId: " + this.config.langId)
        if (
          !this.config.langId ||
          this.config.langId == undefined ||
          this.config.langId == "20"
        ) {
          // this.nav.push(LanguagePage);
          this.openLanguagePage();
        } else {
          this.nav.push(DiscoverPage);
        }
      } else if (val != undefined && val == true) {
        let userData = this.shared.customerData;
        this.shared.registerDevice(userData.customers_id);
        if (
          !this.shared.isCompany &&
          (userData.customers_picture == "" ||
            userData.customers_picture == "default.png")
        ) {
          this.nav.push("GreatingPage");
        } else if (
          this.shared.isCompany &&
          (userData.Latitude == "" ||
            userData.Longitude == null ||
            userData.Latitude == null ||
            userData.Longitude == "" ||
            userData.customers_picture == "" ||
            userData.customers_picture == "logo-default.png" ||
            userData.customers_banner == "" ||
            userData.customers_banner == "banner-default.png" ||
            userData.customers_address == "" ||
            userData.customers_commercial_record == "" ||
            userData.customers_owner_name == "" ||
            userData.customers_busines_title == "")
        ) {
          this.nav.push("GreatingPage");
        } else {
          if (this.shared.isCompany) {
            this.http
              .get(
                this.config.url +
                this.config.checkCompanyIsActive +
                userData.customers_id,
                { headers: this.headers }
              )
              .map(res => res.json())
              .subscribe(
                data2 => {
                  if (
                    data2.Status == true &&
                    data2.Message == "Company is active"
                  ) {
                    this.shared.customerData.isActive = "1";
                    userData.isActive = "1";
                    this.shared.isActive = true;
                    this.events.publish("user:changed", Date.now());
                  } else {
                    this.events.publish("packages", Date.now());
                  }
                },
                error => {
                  this.shared.showToast(
                    "service down.",
                    3000,
                    "top",
                    "error",
                    () => {
                      this.events.publish("user:greeting", Date.now());
                    }
                  );
                }
              );
          } else {
            this.events.publish("user:changed", Date.now());
          }
        }
      }
    });

    let connectedToInternet = true;
    network.onDisconnect().subscribe(() => {
      connectedToInternet = false;
      translate
        .get(["Please Connect to the Internet!", "Disconnected"])
        .subscribe(res => {
          this.alert.showWithTitle(
            res["Please Connect to the Internet!"],
            res["Disconnected"]
          );
        });
      //  console.log('network was disconnected :-(');
    });

    network.onConnect().subscribe(() => {
      if (!connectedToInternet) {
        window.location.reload();
        //this.loading.show();
        //console.log('network connected!');
        translate
          .get(["Network connected Reloading Data", "Connected"])
          .subscribe(res => {
            this.alert.showWithTitle(
              res["Network connected Reloading Data"] + "...",
              res["Connected"]
            );
          });
      }
      //connectSubscription.unsubscribe();
    });
    this.platform.setDir(localStorage.direction, true);
    shared.dir = localStorage.direction;
    //setting default languge on start up

    translate.setDefaultLang(this.config.langName);
    // this.translate.setDefaultLang('en');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log("onLangChange", event.translations);
    });
    this.translate.onDefaultLangChange.subscribe((event: LangChangeEvent) => {
      console.log("onDefaultLangChange", event.translations);
    });

    //}

    events.subscribe("user:changed", time => {
      console.log('2');
      this.app.getRootNavs()[0].setRoot(Home5Page);
    });
    events.subscribe("user:greeting", time => {
      console.log('1');
      this.app.getRootNavs()[0].setRoot(GreatingPage);
    });

    events.subscribe("user:request", time => {
      console.log('3');
      this.nav.setRoot("NewOrderPage");
    });

    events.subscribe("packages", time => {
      console.log('4');
      this.app.getRootNavs()[0].setRoot(PackagesPage);
    });

    events.subscribe("user:logout", time => {
      console.log('5');
      this.app.getRootNavs()[0].setRoot(DiscoverPage);
    });

  }

  handleBackButton() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNavs()[0];
        let activeView = nav.getActive();
        this.alert.show(activeView.name);
        if (activeView.name == "Home5Page") {
          if (nav.canGoBack()) {
            //Can we go back?
            nav.pop();
          } else {
            const alert = this.alertCtrl.create({
              title: "App termination",
              message: "Do you want to close the app?",
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel",
                  handler: () => {
                    console.log("Application exit prevented!");
                  }
                },
                {
                  text: "Close App",
                  handler: () => {
                    this.platform.exitApp(); // Close this application
                  }
                }
              ]
            });
            alert.present();
          }
        } else {
          nav.pop();
        }
      });
    });
  }

  openPage(page) {
    if (page == "home") this.openHomePage();
    else if (page == "home1") this.nav.setRoot(DiscoverPage);
    else if (page == "home5") this.nav.setRoot(Home5Page);
    else if (page == "products") this.nav.setRoot(ProductsPage);
    else if (page == "myAccount") this.nav.setRoot(MyAccountPage);
    else if (page == "myOrders") this.nav.setRoot(MyOrdersPage);
    else if (page == "contactUs") this.nav.setRoot(ContactUsPage);
    else if (page == "aboutUs") this.nav.setRoot(AboutUsPage);
    else if (page == "news") this.nav.setRoot(NewsPage);
    else if (page == "intro") this.nav.setRoot(IntroPage);
    else if (page == "settings") this.nav.setRoot(SettingsPage);
    else if (page == "setup") this.nav.setRoot(SetupPage);
    else if (page == "fav") this.nav.setRoot(FavPage);
    else if (page == "ramzRating") this.nav.setRoot(RamzRatingPage);
    else if (page == "profile") {
      if (this.shared.isCompany) {
        this.nav.setRoot(CompanyAccountPage);
      } else {
        this.nav.setRoot(MyAccountPage);
      }
    } else if (page == "ramz") this.nav.setRoot(RamzPage);
    else if (page == "notifications") this.nav.setRoot(NotificationPage);
    else if (page == "requests") this.nav.setRoot(RequestsPage);
    else if (page == "orders") this.nav.setRoot(OrdersPage);
    else if (page == "NewCompanies") this.nav.setRoot("NewCompaniesPage");
    else if (page == "packages") this.nav.setRoot("PackagesPage");
    else if (page == "commercials") this.nav.setRoot(CommercialsPage);
  }
  openHomePage() {
    if (this.config.homePage == 1) {
      this.nav.setRoot(DiscoverPage);
    }
    if (this.config.homePage == 5) {
      this.nav.setRoot(Home5Page);
    }
  }

  openLanguagePage() {
    // let modal = this.modalCtrl.create(LanguagePage);
    // modal.present();
    // this.nav.push(LanguagePage);
    this.nav.setRoot(LanguagePage);
  }

  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
  }

  showHideHomeList() {
    if (this.homeList == false) {
      this.homeList = true;
      this.homeListIcon = "remove";
    } else {
      this.homeList = false;
      this.homeListIcon = "add";
    }
  }
  showHideCategoriesList() {
    if (this.categoriesList == false) {
      this.categoriesList = true;
      this.categoriesListIcon = "remove";
    } else {
      this.categoriesList = false;
      this.categoriesListIcon = "add";
    }
  }
  showHideShopList() {
    if (this.shopList == false) {
      this.shopList = true;
      this.shopListIcon = "remove";
    } else {
      this.shopList = false;
      this.shopListIcon = "add";
    }
  }
  ionViewWillEnter() {
    // console.log("ionViewCanEnter");
  }
  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is("ios")) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is("android")) {
      this.appVersion.getPackageName().then(val => {
        this.iab.create(
          "https://play.google.com/store/apps/details?id=" + val,
          "_system"
        );
      });
    }
  }

  share() {
    this.loading.autoHide(2000);
    if (this.plt.is("ios")) {
      this.socialSharing
        .share(
          "Nice Application",
          this.config.appName,
          "assets/logo_header.png",
          this.config.packgeName.toString()
        )
        .then(() => { })
        .catch(() => { });
    } else if (this.plt.is("android")) {
      this.appVersion.getPackageName().then(val => {
        this.socialSharing
          .share(
            "Nice Application",
            this.config.appName,
            "assets/logo_header.png",
            "https://play.google.com/store/apps/details?id=" + val
          )
          .then(() => { })
          .catch(() => { });
      });
    }
  }
  logOut() {
    this.shared.logOut();
  }
}
