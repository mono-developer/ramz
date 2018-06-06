
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


@Component({
  selector: 'ramz-rating',
  templateUrl: 'ramz-rating.html',
})
export class RamzRatingPage {

  data = {
    rating: '',
    speed: 3,
    service: 3,
    security: 3,
    easy: 3,
    comments: ''
  };
  total_rating: any = 0;
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  // companyInfo :CompanyInfo;
  constructor(
    public viewCtrl: ViewController,
    loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    private shared: SharedDataProvider,
    public http: Http,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    translate: TranslateService) {
    // this.companyInfo=this.navParams.get('companyInfo') ;
    // this.data.rating=this.companyInfo.Rating;
    this.getRating();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getRating() {
    this.loading.show();

    this.http.get(this.config.url + this.config.ramzRating, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          this.data.speed = data.Result.SpeedRating;
          this.data.service = data.Result.ServiceRating;
          this.data.security = data.Result.SecurityRating;
          this.data.easy = data.Result.EasyUseRating;
          this.changeRate();
        } else if (data.Status == false) {
          this.shared.showToast(data.Message, 3000, 'bottom', 'bottom', () => {
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

  changeRate() {

    let total: number = Number(this.data.speed) +
      Number(this.data.service) +
      Number(this.data.security) +
      Number(this.data.easy);
    const total_rate = total / 4;
    this.data.rating = total_rate.toFixed(1);
  }

  save() {

    let formData: FormData = new FormData();
    // formData.append('companyid', this.companyInfo.CompanyId);
    // if (this.total_rating == null || this.total_rating == undefined) {
    //   this.total_rating = 0 + "";
    // }
    formData.append('rating', this.data.rating + "");
    formData.append('speed', this.data.speed + "");
    formData.append('service', this.data.service + "");
    formData.append('security', this.data.security + "");
    formData.append('easiness', this.data.easy + "");
    formData.append('comment', this.data.comments + "");
    this.loading.show();
    this.http.post(this.config.url + this.config.ramzGiveRating, formData, { headers: this.headers })
      .map(res => res.json()).subscribe(data => {
        this.loading.hide();
        if (data.Status) {
          this.loading.hide();
          this.data.comments = "";
          this.shared.showToast(data.Message, 2000, 'bottom', 'success', () => {
          });
        } else {
          this.shared.showToast("Ramz give rating failed!", 3000, 'bottom', 'error', () => {
          });
        }
      }
        , err => {
          this.loading.hide();
          var errMsg = 'Ramz give rating failed.';
          this.shared.showToast(errMsg, 3000, 'bottom', 'error', () => {
          });

        });
  }



}
