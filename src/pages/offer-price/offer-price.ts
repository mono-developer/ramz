
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


@IonicPage({
  priority: 'high',
  // segment: `home-page`
})
@Component({
  selector: 'offer-price',
  templateUrl: 'offer-price.html',
})
export class OfferPricePage {

  data = {
    orderId: '',
    pricefrom: '',
    priceto: '',
    deliveryday: '',
    deliverymonth: '',
    comment: ''
  };
  langId: number;
  customers_governorate: string;
  customers_city: string;
  monthNames = [];

  days = ["01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"
    , "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

  headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  constructor(
    public viewCtrl: ViewController,
    loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public http: Http,
    public shared: SharedDataProvider,
    public http2: HttpClient,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    translate: TranslateService) {

    this.langId = localStorage.langId;
    if (this.langId == 1) {
      this.monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    } else {
      this.monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    }

    let order = this.navParams.get('order');
    let orderOffers = this.navParams.get('orderOffers');

    if (order != undefined && order) {
      // this.getOrderInfo(order.OrderId);
      this.data.orderId = order.OrderId;
    }
    if (orderOffers != undefined && orderOffers) {
      // this.data.orderId = orderOffers.OrderId;
      // this.data.OfferId = orderOffers.OfferId;
      this.data.pricefrom = orderOffers.PriceFrom;
      this.data.priceto = orderOffers.PriceTo;
      this.data.deliveryday = orderOffers.DeliveryDay;
      this.data.deliverymonth = orderOffers.DeliveryMonth
      // this.data.comment = orderOffers.Description;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {

    let formData: FormData = new FormData();
    formData.append('companyid', this.shared.customerData.customers_id);
    formData.append('orderid', this.data.orderId);
    formData.append('pricefrom', this.data.pricefrom);
    formData.append('priceto', this.data.priceto);
    formData.append('day', this.data.deliveryday);
    formData.append('month', this.data.deliverymonth);
    formData.append('comment', this.data.comment);
    this.loading.show();
    this.http2.post<Status>(this.config.url + this.config.saveReplyoffer, formData).subscribe(data => {
      this.loading.hide();
      if (data.Status) {
        this.shared.showToast(data.Message, 3000, 'bottom', 'success', () => {
        });
      } else {
        this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
        });
      }
    }
      , error => {
        this.loading.hide();
        // console.log("error: " + JSON.stringify(error))
        // console.log("errMsg1: " + JSON.parse(error._body).Message)
        var errMsg = 'Error while Seding Reply offer! ';
        if (error.status == 403) {
          errMsg += '\n' + JSON.parse(error._body).error;
        }
        else if (error.status == 400) {
          errMsg += '\n' + JSON.parse(error._body).Message;
        }
        // console.log("errMsg2: " + errMsg)
        this.shared.showToast(errMsg, 3000, 'bottom', 'error', () => {
        });
      });
  }

  // getOrderInfo(orderId) {
  //   this.loading.show();
  //   this.http.get(this.config.url + this.config.getOrderInfo + orderId, { headers: this.headers })
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.loading.hide();
  //       if (data.Status == true) {
  //         this.data.orderId = data.Result.OrderId;
  //         this.data.pricefrom = data.Result.PriceFrom;
  //         this.data.priceto = data.Result.PriceTo;
  //         this.data.deliveryday = data.Result.DeliveryDay;
  //         this.data.deliverymonth = data.Result.DeliveryMonth;
  //         this.data.comment = data.Result.comment;
  //       } else if (data.Status == false) {
  //         this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
  //         });
  //       }
  //     }, error => {
  //       this.loading.hide();
  //       var errMsg = 'Error while Loading order info! ';
  //       if (error.status == 403) {
  //         errMsg += '\n' + JSON.parse(error._body).error;
  //       }
  //       else if (error.status == 400) {
  //         errMsg += '\n' + JSON.parse(error._body).Message;
  //       }
  //       this.shared.showToast(errMsg, 3000, 'bottom', 'error', () => {
  //       });
  //     });
  // }



}
