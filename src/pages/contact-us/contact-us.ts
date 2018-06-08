
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { AlertProvider } from '../../providers/alert/alert';
import { SearchPage } from '../search/search';

// declare var google;

@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  contact = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public alert: AlertProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    // this.loadMap();
  }
  ionViewWillEnter() {
    this.contact.name = this.shared.customerData.customers_firstname;
    this.contact.email = this.shared.customerData.customers_email_address;
    this.contact.phone = this.shared.customerData.customers_telephone;
  }

  submit() {
    this.loading.show();
    let formData: FormData = new FormData();
    formData.append('name', this.contact.name);
    formData.append('email', this.contact.email);
    formData.append('phone', this.contact.phone);
    formData.append('subject', this.contact.subject);
    formData.append('message', this.contact.message);
    this.http.post(this.config.url + this.config.saveContactus, formData, { headers: this.headers })
      .map(res => res.json()).subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          this.contact.name = '';
          this.contact.email = '';
          this.contact.phone = '';
          this.contact.subject = '';
          this.contact.message = '';
          // this.alert.show(data.message);
          this.shared.showToast(data.Message, 3000, 'bottom', 'success', () => {
            //console.log('Dismissed toast');
          });
        }
      }, function (response) {
        this.loading.hide();
        // this.alert.show("Error server not reponding");
        this.shared.showToast('Saving failed', 3000, 'bottom', 'error', () => {
          //console.log('Dismissed toast');
        });
      });


  };



}
