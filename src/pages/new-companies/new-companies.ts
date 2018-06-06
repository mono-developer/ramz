// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { LoadDataProvider } from '../../providers/load-data/load-data';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { HttpClient } from '@angular/common/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { Status } from '../../models/status';
import { CompanyState } from '../../models/CompanyState';
import { CompanyLatest } from '../../models/CompanyLatest';
import { ProductsPage } from '../products/products';


@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'new-companies',
  templateUrl: 'new-companies.html',
})
export class NewCompaniesPage {


  MonthAgo: string;
  YearAgo: string;
  WeekAgo: string;
  latest = new Array();
  constructor(
    public viewCtrl: ViewController,
    loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public http: HttpClient,
    translate: TranslateService) {
    this.loading.show();
    this.getState();
    this.getCompanyLatest();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getState() {
    this.http.get<CompanyState>(this.config.url + this.config.companyStats).subscribe(data => {
      if (data.Status) {
        this.MonthAgo = data.Result.MonthAgo;
        this.YearAgo = data.Result.YearAgo;
        this.WeekAgo = data.Result.WeekAgo;

      } else {
        this.loading.hide();
      }
    }
      , error => {
        this.loading.hide();
        var errMsg = '';
        errMsg = "Update profie photo failed: \n";
        console.log("error: " + error)
        console.log("errMsg1: " + JSON.parse(error._body).Message)
        errMsg += JSON.parse(error._body).Message;
        console.log("errMsg2: " + errMsg)
      });
  }

  getCompanyLatest() {
    this.http.get<CompanyLatest>(this.config.url + this.config.companyLatest).subscribe(data => {
      if (data.Status) {
        this.latest = data.Result;
        this.loading.hide();
      } else {
        this.loading.hide();
      }
    }

      , error => {
        this.loading.hide();
      });
  } openProducts(subCategory) {
    this.navCtrl.push(ProductsPage, { 'subCategory': subCategory });
  }

}
