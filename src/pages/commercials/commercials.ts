// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
// import { ProductsPage } from '../products/products';
import { CompanyRatingPage } from '../company-rating/company-rating';
import { SharePage } from '../share/share';
import { MapPage } from '../map/map';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-commercials',
  templateUrl: 'commercials.html',
})
export class CommercialsPage {

  commercials = [];
  comC: any;
  direction: string;
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public storage: Storage,
    public toastCtrl: ToastController
  ) {
    this.direction = localStorage.direction;
  }

  ngOnInit() {
    this.getCommercials();
  }

  transform(arr): any {
    let keys = [];
    for (let key of arr) {
      for (var i in key) {
        // console.log('key1: ' + i + ',  value: ' + key[i]);
        for (let company of key[i]) {
          // console.log("company1: " + JSON.stringify(company));
          this.storage.get(`company ${company.CategoryId} ${company.CompanyId} ${company.AgeFrom} ${company.AgeTo}`).then((value) => {
            // console.log("value: " + JSON.stringify(value));
            if (value && JSON.stringify(value) != null) {
              company.favorite = true;
            } else {
              company.favorite = false;
            }
            // console.log("company2: " + JSON.stringify(company));
            // console.log("company2.favorite: " + company.favorite);
          }).catch(() => company.favorite = false);
        }
        keys.push({ key: i, value: key[i] });
      }
    }
    // console.log("keys: " + JSON.stringify(keys));
    return keys;
  }

  openSharePage(event) {
    this.navCtrl.push(SharePage, { 'companyInfo': event });
  }

  openLocationPage(event) {
    this.navCtrl.push(MapPage, { 'companyInfo': event });
  }

  setFav(event) {
    this.storage.get(`company ${event.CategoryId} ${event.CompanyId} ${event.AgeFrom} ${event.AgeTo}`).then((value) => {

      if (value && JSON.stringify(value) != null) {
        this.storage.remove(`company ${event.CategoryId} ${event.CompanyId} ${event.AgeFrom} ${event.AgeTo}`);
        event.favorite = false;

      } else {
        this.storage.set(`company ${event.CategoryId} ${event.CompanyId} ${event.AgeFrom} ${event.AgeTo}`, event);

        event.favorite = true;

      }

    }).catch(() => event.favorite = false);

  }

  getCommercials() {
    this.loading.show();

    this.http.get(this.config.url + this.config.getCommercials + this.config.langId, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        // this.commercials = data.Result;
        if (data.Status == true) {
          this.commercials = this.transform(data.Result);
        }
        else if (data.Status == false) {
          this.commercials = [];
          this.showToast(data.Message, 3000, 'middle', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading commercials! ';
        if (error.status == 403) {
          errMsg += '\n' + JSON.parse(error._body).error;
        }
        else if (error.status == 400) {
          errMsg += '\n' + JSON.parse(error._body).Message;
        }
        this.showToast(errMsg, 3000, 'middle', 'error', () => {
        });
      });

    /*let commercials = [
        {
            "Entertainments": [
              {ImagePath:"default.png", CategoryEnglish:"Al Fateam for Construction"},
              {ImagePath:"default.png", CategoryEnglish:"Essprso Cafee & Resturant"},
              {ImagePath:"default.png", CategoryEnglish:"Benaa for Construction2"},
              {ImagePath:"default.png", CategoryEnglish:"Marina Health"},
              {ImagePath:"default.png", CategoryEnglish:"Internt Club"}
            ]
        },
        {
            "Food & Drinks": [
              {ImagePath:"default.png", CategoryEnglish:"Al Fateam for Construction"},
              {ImagePath:"default.png", CategoryEnglish:"Essprso Cafee & Resturant"},
              {ImagePath:"default.png", CategoryEnglish:"Benaa for Construction2"},
              {ImagePath:"default.png", CategoryEnglish:"Marina Health"},
              {ImagePath:"default.png", CategoryEnglish:"Internt Club"}
            ]
        },
        {
            "Health & Fitness": []
        },
        {
            "Home & Decor": [
              {ImagePath:"default.png", CategoryEnglish:"Al Fateam for Construction"},
              {ImagePath:"default.png", CategoryEnglish:"Essprso Cafee & Resturant"},
              {ImagePath:"default.png", CategoryEnglish:"Benaa for Construction2"},
              {ImagePath:"default.png", CategoryEnglish:"Marina Health"},
              {ImagePath:"default.png", CategoryEnglish:"Internt Club"}
            ]
        },
        {
            "Technology & Innovation": []
        },
        {
            "Travel & Safari": []
        },
        {
            "Women's Fashion": []
        }
    ]
    this.commercials = this.transform(commercials);*/
  }

  showToast(message: string, duration: number, position: string, cssClass: string, fn) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration, //3000
      cssClass: cssClass,
      position: position//'top', "middle", "bottom"
    });

    toast.onDidDismiss(fn);

    toast.present(toast);
  }
}
