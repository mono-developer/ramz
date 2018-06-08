
import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, Content, IonicPage, Events, MenuController, Slides } from 'ionic-angular';
import { SubCategories6Page } from '../sub-categories6/sub-categories6';
import { SearchPage } from '../search/search';
import { LoadingProvider } from '../../providers/loading/loading';
import { Top10Page } from '../top10/top10';
import { HttpClient } from '@angular/common/http';
import { Ads } from '../../models/Ads';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home5',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'home5.html',
})

export class Home5Page {
  @ViewChild(Content) content: Content;
  public categories = new Array();
  public ads = new Array();
  @ViewChild(Slides) slider: Slides;
  segments: any = 'topSeller';
  autoplay: number = 5000;
  constructor(
    public http: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    private events: Events,
    public loading: LoadingProvider,
    private menu: MenuController,
    private iab: InAppBrowser,
    translate: TranslateService) {
    this.menu.enable(true);
    this.http.get<CategoryResponse>(this.config.url + 'category/main').subscribe(data => {
      this.categories = data.Result;
      console.log(this.categories);
      console.log(this.config);
      this.loading.hide();


    });

    this.http.get<Ads>(this.config.url + 'ramz/ads').subscribe(data => {
      this.ads = data.Result
      this.autoplay = (+this.ads[0].InSeconds) * 1000;
      this.loading.hide();
    });
  }
  openSubCategories(categoryModel) {
    this.navCtrl.push(SubCategories6Page, { 'category': categoryModel });
  }

  ngAfterViewChecked() {
    this.content.resize();
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  openPublish() {
    this.navCtrl.push('PublishPage', { 'companyInfo': null });
  }

  openRequestPage() {
    this.navCtrl.push('NewOrderPage', { 'companyInfo': null });
  }

  openTop() {
    this.navCtrl.push(Top10Page);
  }
  openHome() {
    this.navCtrl.setRoot(Home5Page);
  }

  slideChanged() {
    if (this.ads && this.ads.length) {
      this.slider.autoplayDisableOnInteraction = false;
      let currentIndex = this.slider.getActiveIndex();
      if (currentIndex > this.ads.length) {
      } else {
        this.autoplay = (+this.ads[currentIndex - 1].InSeconds) * 1000;
      }

    }

    // // console.log('Current index is', currentIndex);
    // if (currentIndex == 3)
    // this.slider.slideTo(0)
    // else
    // this.url = "assets/intro/" + (+currentIndex + 1) + ".png";
  }
  ionViewDidEnter() {
    if (this.ads && this.ads.length) {
      this.slider.autoplayDisableOnInteraction = false;
    }
  }
  OpenUrl(url: string) {
    const browser = this.iab.create(url);
    browser.show()
  }

}
