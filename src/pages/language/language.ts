// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Http } from '@angular/http';

import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {
  private languages: any;
  selectedLanguage: any = 1;
  translate;
  prviousLanguageId;

  constructor(
    public viewCtrl: ViewController,
    public http: Http,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    translateService: TranslateService,
    public loading: LoadingProvider,
    private storage: Storage,
    private trans: TranslateService
  ) {

    if (localStorage.langId == undefined || localStorage.langId == '20') {
      this.prviousLanguageId = 2;
    } else {
      this.prviousLanguageId = localStorage.langId;
    }
    // console.log("PrviousLanguageId: " + this.prviousLanguageId);
    //getting all languages
    // this.loading.show();
    // this.http.get(config.url + 'getLanguages').map(res => res.json()).subscribe(data => {
    //   this.loading.hide();
    //   this.translate = translateService;
    //   this.languages = data.languages;
    //   for (let data of this.languages) {
    //     if (data.languages_id == this.prviousLanguageId) {
    //       this.selectedLanguage = data;
    //     }
    //   }
    // });

    this.languages = [
      {
        languages_id: 1,
        name: 'Arabic',
        direction: 'rtl',
        image: 'img/oman.svg'
      },
      {
        languages_id: 2,
        name: 'English',
        direction: 'ltr',
        image: 'img/GB.svg'
      }];

    for (let data of this.languages) {
      if (data.languages_id == this.prviousLanguageId) {
        this.selectedLanguage = data;
      }
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
      // this.shared.emptyCart();
      // this.shared.emptyRecentViewed();
      setTimeout(() => {
        window.location.reload();
      }, 300);

    }
  }
}
