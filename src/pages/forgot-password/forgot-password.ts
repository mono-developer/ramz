// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  formData = {
    customers_email_address: '',
  };
  errorMessage = '';
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  customerType = this.shared.customerType;
  langId: number;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public http: Http,
    public config: ConfigProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
    this.langId = localStorage.langId;
  }
  forgetPassword() {
    // this.loading.show();
    var subUrl;
    if (this.customerType == 'company')
      subUrl = this.config.processCompanyForgotPassword;
    else
      subUrl = this.config.processForgotPassword;

    this.errorMessage = '';
    let formData: FormData = new FormData();
    formData.append('email', this.formData.customers_email_address);
    this.http.post(this.config.url + subUrl, formData, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        // if (data.success == 1) {
        if (data.Status == true) {
          this.shared.showToast(this.langId && this.langId == 1 ? data.Arabic : data.Message, 3000, 'top', 'success', () => {
            // console.log('Dismissed toast');
            this.dismiss();
          })
          ///this.dismiss();
        }
        // if (data.success == 0) {
        if (data.Status == false) {
          // this.errorMessage = data.message;
          this.shared.showToast(this.langId && this.langId == 1 && data.Arabic ? data.Arabic : data.Message, 3000, 'top', 'error', () => {
            //console.log('Dismissed toast');
          })
        }
      },
        err => {
          this.loading.hide();
          var errMsg;
          if (err.status == 401) {
            errMsg = this.langId && this.langId == 1 ? JSON.parse(err._body).Arabic : JSON.parse(err._body).Message;
          } else if (err.status == 400) {
            let error = JSON.parse(err._body);
            errMsg = (error.Message.email) ? error.Message.email : '';
          } else
            errMsg = 'Server error';

          //this.errorMessage = errMsg
          //console.log("errMsg : ",errMsg )
          this.shared.showToast(errMsg, 3000, 'top', 'error', () => {
            //console.log('Dismissed toast');
          })
        });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
