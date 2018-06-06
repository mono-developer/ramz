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
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from "@ionic-native/file";

@Component({
  selector: 'page-order-offers',
  templateUrl: 'order-offer.html',
})
export class OrderOfferPage {

  orderOffers = [];
  orderInfo = {};

  commentdata;
  private order;
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  customerType = this.shared.customerType;
  attachedFile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public toastCtrl: ToastController,
    private camera: Camera,
    private readonly file: File
  ) {

    this.order = this.navParams.get('order');

    if (this.order != undefined && this.order)
      this.getOffers(this.order.OrderId);
  }

  replyoffer(order) {
    // console.log(JSON.stringify(order));
    this.navCtrl.push('OfferPricePage', { 'order': order, 'orderOffers': this.orderOffers[0] });
  }

  getOffers(orderId) {
    this.loading.show();
    //
    var subUrl;
    if (this.customerType == 'company') {
      // subUrl = this.config.getCompanyOrderOffers + 1 + '/' + 2;
      subUrl = this.config.getCompanyOrderOffers + this.shared.customerData.customers_id + '/' + orderId;
    } else
      subUrl = this.config.getOrderOffers + orderId;

    this.http.get(this.config.url + subUrl, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          if (this.customerType == 'company') {
            this.orderInfo = data.Result.OrderInfo;
            this.orderOffers = data.Result.OrderOffers;
          } else {
            this.orderInfo = {};
            this.orderOffers = data.Result;
          }

        } else if (data.Status == false) {
          this.orderInfo = {};
          this.orderOffers = [];
          this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading offers! ';
        this.orderInfo = {};
        this.orderOffers = [];
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
