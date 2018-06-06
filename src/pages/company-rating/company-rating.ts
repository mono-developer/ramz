
import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams, ToastController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { LoadDataProvider } from '../../providers/load-data/load-data';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { HttpClient } from '@angular/common/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { Status } from '../../models/status';
import { CompanyInfo } from '../../models/Product';


@IonicPage({
  priority: 'high',
  // segment: `home-page`
})
@Component({
  selector: 'company-rating',
  templateUrl: 'company-rating.html',
})
export class CompanyRatingPage {

  data = {
    companyid: '',
    rating: '',
    price: 3,
    location: 3,
    service: 3,
    quality: 3
  };

  companyInfo: CompanyInfo;
  constructor(
    public viewCtrl: ViewController,
    loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public http: HttpClient,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    translate: TranslateService) {
    this.companyInfo = this.navParams.get('companyInfo');
  }

  ionViewDidLoad() {

    this.data.rating = this.companyInfo.Rating;
    console.log(this.data);
    this.changeRate();
  }

  changeRate() {

    let total: number =
      Number(this.data.price) +
      Number(this.data.location) +
      Number(this.data.service) +
      Number(this.data.quality);
    const total_rate = total / 4;
    this.data.rating = total_rate.toFixed(1);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {


    let formData: FormData = new FormData();
    formData.append('companyid', this.companyInfo.CompanyId);
    if (this.companyInfo.Rating == null || this.companyInfo.Rating == undefined) {
      this.companyInfo.Rating = 0 + "";
    }

    formData.append('rating', this.data.rating);
    formData.append('price', this.data.price + "");
    formData.append('location', this.data.location + "");
    formData.append('quality', this.data.quality + "");
    formData.append('service', this.data.service + "");

    this.loading.show();
    this.http.post<Status>(this.config.url + this.config.giverating, formData).subscribe(data => {
      if (data.Status) {
        this.loading.hide();
        this.dismiss();
      }
    }
      , error => {
        this.loading.hide();
        var errMsg = '';
        errMsg = "Rating Company failed \n";
        errMsg += JSON.parse(error._body).Message;
      });
  }



}
