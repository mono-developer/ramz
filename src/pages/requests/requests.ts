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
import { CommentsPage } from '../comments/comments';

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

  requests = [];
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  customerType = this.shared.customerType;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public toastCtrl: ToastController
  ) {
    this.getRequests();
  }

  openRequests(request) {
    // console.log(JSON.stringify(request));
    this.navCtrl.push(CommentsPage, { 'request': request });
  }

  getRequests() {
    this.loading.show();

    var subUrl;
    if (this.customerType == 'company')
      subUrl = this.config.getCompanyRequests;
    else
      subUrl = this.config.getRequests;

    this.http.get(this.config.url + subUrl + this.shared.customerData.customers_id, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        // this.requests = data.Result;
        if (data.Status == true)
          this.requests = data.Result;
        else if (data.Status == false) {
          this.requests = [];
          this.shared.showToast(data.Message, 1000, 'bottom', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading requests! ';
        if (error.status == 403) {
          errMsg += '\n' + JSON.parse(error._body).error;
        }
        else if (error.status == 400) {
          errMsg += '\n' + JSON.parse(error._body).Message;
        }
        this.shared.showToast(errMsg, 1000, 'bottom', 'error', () => {
        });
      });
  }


}
