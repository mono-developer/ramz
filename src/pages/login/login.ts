// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { ViewController, ModalController, ToastController, NavController, Nav, Events, App } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AlertProvider } from '../../providers/alert/alert';
import { GooglePlus } from '@ionic-native/google-plus';
import { Home5Page } from '../home5/home5';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',

})
export class LoginPage {
  formData = { customers_email_address: '', customers_password: '' };
  errorMessage = '';
  notifyMessage = '';
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  customerType = this.shared.customerType;
  langId: number;

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private fb: Facebook,
    public alert: AlertProvider,
    private googlePlus: GooglePlus,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public events: Events,
    public storage: Storage,
    public app: App
  ) {
    this.langId = localStorage.langId;
  }

  login() {
    this.loading.show();
    this.errorMessage = '';
    this.notifyMessage = '';
    let formData: FormData = new FormData();
    formData.append('email', this.formData.customers_email_address);
    formData.append('password', this.formData.customers_password);
    var subUrl;
    // console.log('this.customerType: ' + this.customerType);
    if (!this.shared.isCompany)
      subUrl = this.config.processLogin;
    else if (this.customerType == 'company')
      subUrl = this.config.processCompanyLogin;

    this.http
      .post(this.config.url + subUrl, formData, { headers: this.headers })
      .map(res => res.json())
      .subscribe(
        data => {
          this.loading.hide();
          if (data.Status == true) {
            // this.notifyMessage = data.Message;
            let userData = data.Result;
            //{"UserId":"1","CityId":"10","Name":"Ahmed Allam","Mobile":"12345688","Email":"mohammed.fathi.allam@gmail.com","Age":"25", "Photo":"1517845083er2.jpg","DeviceType":"1","Token":"cVr9CWJQaPc:APA91bGkkH2aZQgCsgNXUyvRIQH36k82kCHonFqC3VPHoDugXCgcHLhDLZ412oPdo82f6uOzE5J_2Yek6SsCKyW432P3JYSi6VYWGUKy9Rsot30kWyqwvag9c5EwHdWEcyyYpjKQw4fn","Notification":"1"} 
            var customerData;
            if (!this.shared.isCompany) {
              customerData = {
                customers_id: userData.UserId,
                customers_firstname: userData.Name,
                customers_lastname: userData.LastName || '',
                customers_email_address: userData.Email,
                customers_password: (userData.Password || ''),
                customers_telephone: userData.Mobile,
                customers_governorate: userData.GovernorateId || '',
                customers_city: userData.CityId,
                customers_age: userData.Age,
                gender: userData.Gender,
                customers_picture: userData.Photo,
                customers_device_type: userData.DeviceType,
                customers_token: userData.Token,
                customers_notification: userData.Notification
              };

            } else if (this.customerType == 'company') {
              customerData = {
                customers_id: userData.CompanyId,
                customers_firstname: userData.CompnayName,
                customers_lastname: userData.LastName || '',
                customers_email_address: userData.EmailAddress,
                customers_password: (userData.Password || ''),
                customers_telephone: userData.Mobile,
                customers_governorate: userData.GovernorateId || '',
                customers_city: userData.CityId,
                customers_address: userData.Address,
                customers_picture: userData.Logo,
                customers_device_type: userData.DeviceType,
                customers_token: userData.Token,
                customers_notification: userData.Notification,
                customers_category_id: userData.CategoryId,
                customers_package_id: userData.PackageId,
                customers_commercial_record: userData.CommercialRecord,
                customers_busines_title: userData.BusinesTitle,
                customers_owner_name: userData.OwnerName,
                customers_banner: userData.Banner,
                customers_faceBook: userData.FaceBook,
                customers_twitter: userData.Twitter,
                customers_instagram: userData.Instagram,
                customers_description: userData.Description,
                customers_total__viewed: userData.TotalViewed,
                customers_is_active: userData.IsActive,
                customers_package_expires: userData.PackageExpires,
                customers_created_at: userData.CreatedAt,
                isActive: userData.IsActive,
                Latitude: userData.Latitude,
                Longitude: userData.Longitude,
              };
            }
            //this.shared.login(data.data[0]);
            this.shared.login(customerData);
            this.shared.registerDevice(customerData.customers_id);
            this.storage.set('isLogged', true);
            this.shared.isAuthenticated = true;
            if (this.shared.isCompany)
              this.shared.setCompanyStatus(userData.IsActive);
            // 

            if ((this.customerType != null && this.customerType == 'user') && (userData.Photo == "" || userData.Photo == "default.png")) {
              this.app.getRootNavs()[0].setRoot('GreatingPage');

            } else if (this.customerType == 'company' && (userData.Logo == "" || userData.Logo == "logo-default.png" || userData.Banner == "" || userData.Banner == "banner-default.png" || userData.Address == "" || userData.CommercialRecord == "" || userData.OwnerName == "" || userData.BusinesTitle == "")) {
              this.app.getRootNavs()[0].setRoot('GreatingPage');

            } else {
              if (this.shared.isCompany) {
                if (userData.IsActive != "1") {
                  this.app.getRootNavs()[0].setRoot('PackagesPage');
                } else {
                  this.events.publish('user:changed', Date.now());
                }
              } else {
                this.events.publish('user:changed', Date.now());
              }

            }
            // this.navCtrl.setRoot('Home5Page');    
            // this.shared.showToast(this.langId && this.langId == 1 ? data.Arabic : data.Message, 3000, 'top', 'success', () => {
            //   //console.log('Dismissed toast');

            // });
            this.dismiss();
          }
          if (data.Status == false) {
            this.storage.set('isLogged', false);
            //this.errorMessage = this.langId && this.langId == 1 ? data.Arabic : data.Message;
            // this.errorMessage = "Sign in failed! Wrong password or username.";
            this.shared.showToast(this.langId && this.langId == 1 ? data.Arabic : data.Message, 3000, 'top', 'error', () => {
              //console.log('Dismissed toast');
            });
          }
        },
        err => {
          this.loading.hide();
          this.storage.set('isLogged', 'false');
          var errMsg;
          if (err.status == 401)
            // errMsg = "Sign in failed! Wrong password or username.";
            errMsg = this.langId && this.langId == 1 ? JSON.parse(err._body).Arabic : JSON.parse(err._body).Message;
          else if (err.status == 400) {
            let error = JSON.parse(err._body);
            errMsg = (error.Message.email && error.Message.password) ? error.Message.email + '   ' + error.Message.password : (error.Message.email) ? error.Message.email : (error.Message.password) ? error.Message.password : this.langId && this.langId == 1 && error.Arabic ? error.Arabic : error.Message;
          } else
            errMsg = 'Server error!';

          // this.errorMessage = errMsg
          //console.log("errMsg : ",errMsg )
          this.shared.showToast(errMsg, 3000, 'top', 'error', () => {
            //console.log('Dismissed toast');
          });
        })

  }

  refreshDeviceToken() {


  }
  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
    this.dismiss();
  }
  openForgetPasswordPage() {
    let modal = this.modalCtrl.create(ForgotPasswordPage);
    modal.present();
  }

  facebookLogin() {
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == 'connected') {
        console.log("user connected already" + res.authResponse.accessToken);
        this.createAccount(res.authResponse.accessToken, 'fb');

      }
      else {
        console.log("USer Not login ");
        this.fb.login(['public_profile', 'user_friends', 'customers_email_address'])
          .then((res: FacebookLoginResponse) => {
            // this.alert.show('Logged into Facebook!' + JSON.stringify(res));
            console.log("successfully login ");
            this.createAccount(res.authResponse.accessToken, 'fb');
          })
          .catch(e => this.alert.show('Error logging into Facebook' + JSON.stringify(e)));
      }
    }).catch(e => this.alert.show('Error Check Login Status Facebook' + JSON.stringify(e)));
  }

  googleLogin() {
    this.loading.autoHide(500);
    this.googlePlus.login({})
      .then(res => {
        //  alert(JSON.stringify(res))
        this.createAccount(res, 'google');
      })
      .catch(err => this.alert.show(JSON.stringify(err)));
  }
  //============================================================================================  
  //creating new account using function facebook or google details 
  createAccount(info, type) {
    // alert(info);
    this.loading.show();
    var data: { [k: string]: any } = {};
    var url = '';
    if (type == 'fb') {
      url = 'facebookRegistration';
      data.access_token = info;
    }
    else {
      url = 'googleRegistration';
      data = info;
    }
    this.http.post(this.config.url + url, data).map(res => res.json()).subscribe(data => {
      this.loading.hide();
      // alert("data get");
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //alert('login');
        this.alert.showWithTitle("<h3 text-wrap>Your Account has been created successfully !</h3><ul><li>Your Email: "
          + "<span>" + this.shared.customerData.customers_email_address + "</span>" + "</li><li>Your Password: "
          + "<span>" + this.shared.customerData.customers_password + "</span>" +
          " </li></ul><p text-wrap >You can login using this Email and Password.<br>You can change your password in Menu -> My Account</p>", "Account Information");
        //  $ionicSideMenuDelegate.toggleLeft();
        this.dismiss();

      }
      else if (data.success == 2) {
        //  alert("login with alreday");
        this.dismiss();
        this.shared.login(data.data[0]);
      }

    }, error => {
      this.loading.hide();
      this.alert.show("error " + JSON.stringify(error));
      // console.log("error " + JSON.stringify(error));
    });
  };
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }


}
