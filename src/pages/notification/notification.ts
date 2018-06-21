
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notifications = [];
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
    this.getNotifications();
  }

  getNotifications() {
    this.loading.show();
    var subUrl;
    if (this.customerType == 'company')
      subUrl = this.config.getCompanyNotification;
    else
      subUrl = this.config.getNotification;

    this.http.get(this.config.url + subUrl + this.shared.customerData.customers_id, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        // this.notifications = data.Result;
        if (data.Status == true)
          this.notifications = data.Result;
        else if (data.Status == false) {
          this.notifications = [];
          this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading notifications! ';
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


}
