// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
// Version: 1.0

if (localStorage.langId == undefined) {
  localStorage.langId = "20";
  localStorage.langName = "en";
}
if (localStorage.direction == undefined) {
  localStorage.direction = "ltr";
}

import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  IonicPageModule
} from "ionic-angular";
import { HttpModule, Http } from "@angular/http";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { MyApp } from "./app.component";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ConfigProvider } from "../providers/config/config";
import { createTranslateLoader } from "../providers/translate/translate";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from "@ionic/storage";
import { Camera } from "@ionic-native/camera";
import { ProductsProvider } from "../providers/products/products";

import { LanguagePage } from "../pages/language/language";
import { SignUpPage } from "../pages/sign-up/sign-up";
import { LoginPage } from "../pages/login/login";

import { IntroPage } from "../pages/intro/intro";
import { AboutUsPage } from "../pages/about-us/about-us";
import { ContactUsPage } from "../pages/contact-us/contact-us";
import { LoadingProvider } from "../providers/loading/loading";
import { SharedDataProvider } from "../providers/shared-data/shared-data";

import { ForgotPasswordPage } from "../pages/forgot-password/forgot-password";

import { ProductComponent } from "../components/product/product";
import { SwiperViewComponent } from '../components/swiper-view/swiper-view.component';
import { SwiperRoundComponent } from '../components/swiper-round/swiper-round.component';
import { ProductDetailPage } from "../pages/product-detail/product-detail";
import { CurencyPipe } from "../pipes/curency/curency";
import { Toast } from "@ionic-native/toast";
import { SearchPage } from "../pages/search/search";
import { AlertProvider } from "../providers/alert/alert";
// import { CategoriesPage } from '../pages/categories/categories';
import { ProductsPage } from "../pages/products/products";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Stripe } from "@ionic-native/stripe";
import { CouponProvider } from "../providers/coupon/coupon";
import { PayPal } from "@ionic-native/paypal";
import { MyAccountPage } from "../pages/my-account/my-account";
import { MyOrdersPage } from "../pages/my-orders/my-orders";
import { OrderDetailPage } from "../pages/order-detail/order-detail";
import { NewsPage } from "../pages/news/news";
import { SettingsPage } from "../pages/settings/settings";
import { NewsDetailPage } from "../pages/news-detail/news-detail";
import { NewsListPage } from "../pages/news-list/news-list";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Device } from "@ionic-native/device";
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";
import { PrivacyPolicyPage } from "../pages/privacy-policy/privacy-policy";
import { TermServicesPage } from "../pages/term-services/term-services";
import { RefundPolicyPage } from "../pages/refund-policy/refund-policy";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Network } from "@ionic-native/network";
import { SubCategories6Page } from "../pages/sub-categories6/sub-categories6";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppVersion } from "@ionic-native/app-version";
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClient
} from "@angular/common/http";
import { TokenInterceptor } from "../providers/interceptor/token.interceptor";
import { DiscoverPage } from "../pages/discover/discover";
// Import ionic2-rating module
import { Ionic2RatingModule } from "ionic2-rating";
import { SwiperModule } from 'angular2-useful-swiper';
import { LoadDataProvider } from "../providers/load-data/load-data";
import { File } from "@ionic-native/file";
import { NotificationPage } from "../pages/notification/notification";
import { RequestsPage } from "../pages/requests/requests";
import { CommentsPage } from "../pages/comments/comments";
import { ElasticHeader } from "../pages/elastic-header/elastic-header";
import { SetupPage } from "../pages/setup/setup";
import { AngularSvgIconModule } from "angular-svg-icon";
import { FavPage } from "../pages/fav/fav";
import { CompanyAccountPage } from "../pages/company-account/company-account";
import { AgmCoreModule } from "@agm/core";
import { OrdersPage } from "../pages/orders/orders";
import { OrderOfferPage } from "../pages/order-offer/order-offer";
import { CallNumber } from "@ionic-native/call-number";
import { Keyboard } from "@ionic-native/keyboard";
import { CommercialsPage } from "../pages/commercials/commercials";
import { SetLocationPage } from "../pages/set-location/set-location";
import { Geolocation } from "@ionic-native/geolocation";
import { PlacesService } from "../providers/services/places";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapPage } from "../pages/map/map";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { Top10Page } from "../pages/top10/top10";
import { RamzRatingPage } from "../pages/ramz-rating/ramz-rating";
import { RamzPage } from "../pages/ramz/ramz";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FileTransfer } from "@ionic-native/file-transfer";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { Home5Page } from "../pages/home5/home5";
export function setTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    SetupPage,
    IntroPage,
    ElasticHeader,
    FavPage,
    SubCategories6Page,
    ProductsPage,
    DiscoverPage,
    LanguagePage,
    ContactUsPage,
    AboutUsPage,
    IntroPage,
    LoginPage,
    SignUpPage,

    ForgotPasswordPage,
    MyAccountPage,
    CompanyAccountPage,
    ProductComponent,
    SwiperViewComponent,
    SwiperRoundComponent,
    ProductDetailPage,
    CurencyPipe,
    Home5Page,

    OrderDetailPage,
    SetLocationPage,
    MyOrdersPage,
    PrivacyPolicyPage,
    RefundPolicyPage,
    TermServicesPage,
    RamzPage,
    NewsPage,
    NewsDetailPage,
    NewsListPage,
    SettingsPage,
    NotificationPage,
    RequestsPage,
    CommentsPage,
    OrdersPage,
    OrderOfferPage,
    MapPage,
    CommercialsPage,
    Top10Page,
    RamzRatingPage
  ],
  imports: [
    FormsModule,
    IonicImageViewerModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyA2CY_flMWr47yE6sAJrcIcBNyd8M9QQpE",
      libraries: ["places"]
    }),
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      backButtonText: "",
      iconMode: "md",
      mode: "md",
      backButtonIcon: "ios-arrow-back",
      //  swipeBackEnabled: true ,
      platforms: { android: { scrollAssist: false, autoFocusAssist: false } }
    }),
    Ionic2RatingModule,
    HttpClientModule,
    HttpModule,
    BrowserModule,
    SwiperModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    LazyLoadImageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: setTranslateLoader,
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    SearchPage,
    Home5Page,
    SetupPage,
    SubCategories6Page,
    IntroPage,
    PrivacyPolicyPage,
    RefundPolicyPage,
    TermServicesPage,
    SetLocationPage,
    LanguagePage,
    ProductsPage,
    ContactUsPage,
    AboutUsPage,
    IntroPage,
    DiscoverPage,
    LoginPage,
    SignUpPage,
    FavPage,
    RamzPage,
    MyAccountPage,
    CompanyAccountPage,
    ForgotPasswordPage,
    ProductComponent,
    SwiperViewComponent,
    SwiperRoundComponent,
    ProductDetailPage,

    MyOrdersPage,
    OrderDetailPage,
    NewsPage,
    NewsDetailPage,
    NewsListPage,
    SettingsPage,
    NotificationPage,
    RequestsPage,
    CommentsPage,
    OrdersPage,
    OrderOfferPage,
    CommercialsPage,
    Top10Page,
    RamzRatingPage
  ],
  providers: [
    Geolocation,
    PlacesService,
    LoadDataProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    File,
    StatusBar,
    CallNumber,
    SplashScreen,
    SocialSharing,
    Toast,
    ConfigProvider,
    ProductsProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ProductsProvider,
    LoadingProvider,
    SharedDataProvider,
    Camera,
    Stripe,
    AlertProvider,
    CouponProvider,
    PayPal,
    Device,
    Facebook,
    GooglePlus,
    LocalNotifications,
    InAppBrowser,
    Network,
    AppVersion,
    LocationAccuracy,
    Keyboard,
    FileTransfer,
    InAppBrowser
    // SpinnerProvider,
    // MapProvider
  ]
})
export class AppModule { }
