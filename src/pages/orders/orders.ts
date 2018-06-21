import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { CommentsPage } from '../comments/comments';
import { OrderOfferPage } from '../order-offer/order-offer';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  orders = [];
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
    this.getOrders();
  }

  openOrders(order) {
    // console.log(JSON.stringify(order));
    this.navCtrl.push(OrderOfferPage, { 'order': order });
  }

  getOrders() {
    this.loading.show();

    var subUrl;
    if (this.customerType == 'company') {
      // subUrl = this.config.getCompanyOrders+3;
      subUrl = this.config.getCompanyOrders + this.shared.customerData.customers_category_id;
    } else
      subUrl = this.config.getOrders + this.shared.customerData.customers_id;

    this.http.get(this.config.url + subUrl, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        // this.orders = data.Result;
        if (data.Status == true)
          this.orders = data.Result;
        else if (data.Status == false) {
          this.orders = [];
          this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading orders! ';
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
