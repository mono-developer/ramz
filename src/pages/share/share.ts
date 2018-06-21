import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, ToastController } from 'ionic-angular';
import { MyAccountPage } from '../my-account/my-account';
import { Http, Headers } from '@angular/http';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { CompanyAccountPage } from '../company-account/company-account';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { CallNumber } from '@ionic-native/call-number';
import { MapPage } from '../map/map';

/**
 * Generated class for the GreatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  customerType = this.shared.customerType;
  companyInfo;
  iosLink: string = "https://itunes.apple.com/us/app/rmz/id1397821220";
  androidLink: string = "https://play.google.com/store/apps/details?id=com.rmz.albawareg";
  shareURL: string;
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion,
    public loading: LoadingProvider,
    public http: Http,
    public toastCtrl: ToastController,
    private callNumber: CallNumber
  ) {
    this.companyInfo = this.navParams.get('companyInfo');
    if (this.plt.is('ios')) {
      this.shareURL = this.iosLink;
    } else {
      this.shareURL = this.androidLink;
    }

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad GreatingPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  facebookShare() {
    console.log(this.companyInfo.FaceBook, this.config.companyImageURL + this.companyInfo.Logo, this.shareURL);
    this.loading.autoHide(2000);
    this.socialSharing.shareViaFacebook(
      "",
      "",
      this.shareURL
    ).then(() => {
    }).catch(() => {
    });
  }

  twitterShare() {
    this.loading.autoHide(2000);
    this.socialSharing.shareViaTwitter(
      this.companyInfo.Twitter,
      this.config.companyImageURL + this.companyInfo.Logo,
      this.shareURL
    ).then(() => {
    }).catch(() => {
    });
  }

  instagramShare() {
    this.loading.autoHide(2000);
    this.socialSharing.shareViaInstagram(
      this.companyInfo.Instagram,
      this.shareURL
    ).then(() => {
    }).catch(() => {
    });
  }

  openLocationPage(c) {
    this.navCtrl.push(MapPage, { 'companyInfo': c });
  }

  whatsShare() {
    this.loading.autoHide(2000);
    this.socialSharing.shareViaWhatsApp(
      this.companyInfo.FaceBook,
      this.config.companyImageURL + this.companyInfo.Logo,
      this.shareURL
    ).then(() => {
    }).catch(() => {
    });
  }

  callPhone(telephoneNumber: string) {
    this.callNumber.callNumber(telephoneNumber, true);
  }


}
