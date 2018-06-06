// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { LoadingProvider } from '../../providers/loading/loading';
import { Storage } from '@ionic/storage';
import { ViewController, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {
  setting: { [k: string]: any } = {};
  private languages: any;
  selectedLanguage;
  translate;
  prviousLanguageId;
  // private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });

  constructor(
    public viewCtrl: ViewController,
    public config: ConfigProvider,
    public http: Http,
    public shared: SharedDataProvider,
    private storage: Storage,
    public loading: LoadingProvider,
    private trans: TranslateService,
    public navCtrl: NavController,
  ) {
    // this.storage.get('notification').then((val) => {
    //   console.log("Setting: " + val)
    // });
    // this.storage.get('langId').then((val) => {
    //   console.log("langId: " + val)
    // });
    this.setting.notification = localStorage.notification;
    this.prviousLanguageId = localStorage.langId;
    this.languages = [
      {
        languages_id: 1,
        name: 'Arabic',
        direction: 'rtl',
        image: ''
      },
      {
        languages_id: 2,
        name: 'English',
        direction: 'ltr',
        image: ''
      }];

    for (let data of this.languages) {
      if (data.languages_id == this.prviousLanguageId) {
        this.selectedLanguage = data;
      }
    }
  }

  updateLanguage(lang) {
    // if (lang != undefined && this.prviousLanguageId != lang.languages_id) {
    if (lang != undefined) {
      this.loading.show();
      //this.translate.use(lang.languages_id);
      localStorage.langId = lang.languages_id;
      localStorage.direction = lang.direction;
      this.storage.set('langId', lang.languages_id);
      if (lang.languages_id == 1)
        this.config.langName = 'ar';
      else if (lang.languages_id == 2)
        this.config.langName = 'en';
      else
        this.config.langName = 'en';
      localStorage.langName = this.config.langName;
      this.trans.setDefaultLang(this.config.langName);
      setTimeout(() => {
        window.location.reload();
      }, 300);

    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateSetup() {

    localStorage.notification = this.setting.notification;
    this.storage.set('notification', this.setting.notification);

    this.updateLanguage(this.selectedLanguage);
    this.dismiss();
  }
  logOut() {
    this.shared.logOut();
  }

  openPrivacyPolicyPage() {
    this.navCtrl.push(PrivacyPolicyPage);
  }
}
