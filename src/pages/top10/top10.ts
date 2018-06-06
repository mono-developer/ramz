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
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-top10',
  templateUrl: 'top10.html',
})
export class Top10Page {

  top10s = [];
  direction: string;
  currentDate = new Date();
  months = [];
  configURL: string = '';
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    private shared: SharedDataProvider,
    public loading: LoadingProvider,
    public toastCtrl: ToastController
  ) {
    this.direction = localStorage.direction;
    if (this.direction == 'rtl') {
      this.months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    } else {
      this.months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    }
    this.getTop10();
  }

  transform(obj): any {
    let keys = [];

    Object.keys(obj).forEach(key => {
      // console.log(key); //key      
      // console.log(obj[key]); //value    
      keys.push({ 'key': key, 'value': obj[key] });
    });
    // console.log("keys: " + JSON.stringify(keys));
    return keys;
  }

  getTop10() {
    this.loading.show();
    this.http.get(this.config.url + this.config.top10, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          this.top10s = this.transform(data.Result);
          this.configURL = this.config.companyImageURL;
        } else {
          this.top10s = [];
          this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading Top 10! ';
        if (error.status == 403) {
          errMsg += '\n' + JSON.parse(error._body).error;
        }
        else if (error.status == 400) {
          errMsg += '\n' + JSON.parse(error._body).Message;
        }
        this.shared.showToast(errMsg, 3000, 'bottom', 'error', () => {
        });
      });
  }


  openCompany(event) {
    this.navCtrl.push(ProductsPage, { 'companyId': event.CompanyId });
  }

}
