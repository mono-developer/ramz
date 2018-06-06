// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { Platform, NavController, ToastController, ViewController, Events, App, MenuController, Content } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from "@ionic-native/file";
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { SearchPage } from '../search/search';
import { LoadDataProvider } from '../../providers/load-data/load-data';
import { Home5Page } from '../home5/home5';
import { normalizeURL } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Keyboard } from '@ionic-native/keyboard';
// import { FormControl } from '@angular/forms';

@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {
  myAccountData = {
    customers_firstname: '',
    customers_lastname: '',
    customers_email_address: '',
    currentPassword: '',
    customers_password: '',
    customers_telephone: '',
    customers_governorate: '',
    customers_city: '',
    gender: '',
    customers_age: '',
    customers_dob: '',
    customers_old_picture: ''
  };
  profilePicture = '';
  isNotData: boolean = true;
  isNotPicture: boolean = true;
  public tempPhoto: any = null;
  passwordData: { [k: string]: any } = {};
  profileSelected: string = "data";
  isAndroid: boolean = false;
  langId: number;
  governorates: any;
  customersInterests: any = [];
  cities: any;
  private transfer: FileTransferObject = this.fileTransfer.create();
  // selectedCategories: any[] = [];
  allCategories: any[] = this.shared.allCategories;
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  isKeyboardHide: boolean = true;
  @ViewChild(Content) content: Content;
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public translate: TranslateService,
    public platform: Platform,
    private camera: Camera,
    public navCtrl: NavController,
    public alert: AlertProvider,
    private cf: ChangeDetectorRef,
    public loading: LoadingProvider,
    loadDataProvider: LoadDataProvider,
    private readonly file: File,
    public toastCtrl: ToastController,
    private fileTransfer: FileTransfer,
    public viewCtrl: ViewController,
    private events: Events,
    public app: App,
    private menu: MenuController,
    private keyboard: Keyboard
  ) {

    keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
      setTimeout(() => { // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
        this.content.resize();
      }, 100);
    });

    keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
      setTimeout(() => { // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
        this.content.resize();
      }, 100);
    });

    if (!shared.isCompany && (this.shared.customerData.customers_picture == "" || this.shared.customerData.customers_picture == "default.png")) {
      this.menu.enable(false)
    } else
      this.menu.enable(true)
    this.isAndroid = platform.is('android');
    this.langId = localStorage.langId;
    // TODO: show progress
    loadDataProvider.getGovernorates().then(data => {
      // TODO: turn off menu load json progress

      // data after proccessed.
      this.governorates = data;
    }, err => console.log(err));
    if (this.shared.customerData.customers_id && (!this.customersInterests || this.customersInterests.length == 0)) {
      this.getCustomersInterests(this.shared.customerData.customers_id).then(data => {
        this.shared.customerData.customers_interests = data;
        this.shared.login(this.shared.customerData);

        this.allCategories.forEach(cat => {
          // if (this.customersInterests.filter(ci => ci.InterestCategoryId == cat.CategoryId && ci.Status == 1).length > 0) {
          if (this.customersInterests.filter(ci => ci.InterestCategoryId == cat.CategoryId).length > 0) {
            cat.checked = true;
          } else {
            cat.checked = false;
          }
        });
      }, err => console.log(err));
    }

    console.log('account_data', this.myAccountData);
  }

  getCustomersInterests(userId) {
    if (this.customersInterests && this.customersInterests > 0) {
      // already loaded data
      // console.log("already loaded data customersInterests: " + JSON.stringify(this.customersInterests))
      return Promise.resolve(this.customersInterests);
    }
    return new Promise(resolve => {
      // console.log("NOT loaded data customersInterests: " + JSON.stringify(this.customersInterests))
      this.http.get(this.config.url + this.config.getCustomerInterests + userId, { headers: this.headers })
        .map(res => res.json())
        .subscribe(data => {
          if (data.Status == true) {
            this.customersInterests = data.Result;
          } else {
            this.customersInterests = [];
          }
          resolve(this.customersInterests);
        });
    });
  }

  getCities(goverId) {
    this.http.get(this.config.url + this.config.getCities + goverId, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.cities = data.Result;
        // return Promise.resolve(data.Result);
      });
  }

  selectCategory(cat, event) {
    if (event.checked)
      this.customersInterests.push({ "InterestCategoryId": cat.CategoryId });
    else
      this.customersInterests = this.customersInterests.filter(sc => sc.InterestCategoryId != cat.CategoryId);
    // console.log("customersInterests2: "+JSON.stringify(this.customersInterests))
  }

  isCategorySelected(catId) {
    // if (this.customersInterests && this.customersInterests.filter(ci => ci.InterestCategoryId == catId && ci.Status == 1).length > 0) {
    if (this.customersInterests && this.customersInterests.filter(ci => ci.InterestCategoryId == catId).length > 0) {
      return true;
    } else {
      return false;
    }
  }


  segmentChanged() {
    this.cf.detectChanges();
  }

  //============================================================================================  
  //function updating user information
  updateInfo = function () {
    this.loading.show();
    console.log(this.myAccountData);
    this.myAccountData.customers_id = this.shared.customerData.customers_id;
    let formData: FormData = new FormData();
    formData.append('cityid', this.myAccountData.customers_city);
    formData.append('mobile', this.myAccountData.customers_telephone);
    formData.append('email', this.myAccountData.customers_email_address);
    formData.append('name', this.myAccountData.customers_firstname);
    formData.append('age', this.myAccountData.customers_age);
    formData.append('gender', this.myAccountData.gender);
    formData.append('userid', this.myAccountData.customers_id);


    this.http.post(this.config.url + this.config.updateCustomerInfo, formData, { headers: this.headers }).map(res => res.json()).subscribe(data => {
      console.log(formData);
      this.loading.hide();
      if (data.Status == true) {
        //   document.getElementById("updateForm").reset();
        // this.alert.show(data.Message);
        console.log('1');
        this.shared.customerData.customers_firstname = this.myAccountData.customers_firstname;
        this.shared.customerData.customers_lastname = this.myAccountData.customers_lastname;
        this.shared.customerData.customers_telephone = this.myAccountData.customers_telephone;
        // this.shared.customerData.customers_picture = data.data[0].customers_picture;
        // console.log('>>>>> '+data.Result)
        if (data.Result != null && data.Result.Photo != null)
          this.shared.customerData.customers_picture = data.Result.Photo;

        this.shared.customerData.customers_dob = this.myAccountData.customers_dob;
        if (this.myAccountData.customers_password != '')
          this.shared.customerData.customers_password = this.myAccountData.customers_password;

        this.shared.login(this.shared.customerData);

        this.myAccountData.currentPassword = "";
        this.myAccountData.customers_password = "";
        this.shared.showToast('Successfully updated profile data.', 2000, 'bottom', 'success', () => {
          //console.log('Dismissed toast');
          this.profileSelected = 'photo';
          this.isNotData = false;
        });
      }
    }
      , error => {
        this.loading.hide();
        var errMsg = '';
        if (error.status == 400) {
          if (this.langId && this.langId == 1)
            errMsg = "Sorry, Update profie data failed! Please check your inputs."
          else {
            errMsg = "Sorry, Update profie data failed: \n";
            let errors = JSON.parse(error._body).Message;
            for (let key in errors) {
              errMsg += (key + " : " + errors[key] + "! \n ");
            }
          }
        } else
          errMsg = 'Error while Updating!';

        // this.errorMessage = errMsg
        // this.alert.show(errMsg);
        this.shared.showToast(errMsg, 2000, 'bottom', 'error', () => {
          //console.log('Dismissed toast');
        });
      });
    // }
  }

  updateInterests = function () {
    // console.log("customersInterests3: "+JSON.stringify(this.customersInterests))
    if (this.customersInterests && this.customersInterests.length > 0) {
      let customers_id = this.shared.customerData.customers_id;

      this.loading.show();

      var ids = '';
      this.customersInterests.forEach(ci => {
        ids += ci.InterestCategoryId + ',';
      });

      let formData: FormData = new FormData();
      formData.append('userid', customers_id);
      formData.append('categories', ids);

      console.log(this.formData);

      this.http.post(this.config.url + this.config.updateCustomerInterests, formData, { headers: this.headers })
        .map(res => res.json()).subscribe(data => {
          if (data.Status == true) {
            this.customersInterests = data.Result;
            this.shared.customerData.customers_interests = data.Result;
            this.shared.login(this.shared.customerData);
            this.loading.hide();
            this.shared.showToast('Successfully updated user interests.', 2000, 'bottom', 'success', () => {
              this.app.getRootNavs()[0].setRoot(Home5Page);
            });
          }
        }
          , error => {
            this.loading.hide();
            // isError = true;
            var errMsg = '';
            if (error.status == 400) {
              if (this.langId && this.langId == 1)
                errMsg = "Sorry, Update profile data failed!";
              else {
                errMsg = `Update profie interests failed: \n`;
                errMsg += JSON.parse(error._body).Message;
              }
            } else
              errMsg = 'Error while Updating!';

            this.shared.showToast('Sorry, Error while Updating user interests!', 2000, 'bottom', 'error', () => {
              //console.log('Dismissed toast');
            });
          });
    } else {
      this.shared.showToast('Sorry, You should select at least one interest!', 2000, 'bottom', 'error', () => {
        //console.log('Dismissed toast');
      });
    }
  }



  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      sourceType: 1
    }
    this.platform.ready().then(() => {
      this.camera.getPicture(options).then((imageData) => {
        this.tempPhoto = imageData;
        this.profilePicture = normalizeURL(imageData);
      }, (err) => {
        this.alert.show(err)
        // console.log("Error at openCamera to get Picture: " + err)
      });
    });
  }

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
      this.tempPhoto = imageData;
      this.profilePicture = normalizeURL(imageData);

      //this.uploadPhoto(imageData);
    }, error => {
      this.alert.show(error)
      // this.error = JSON.stringify(error);
      // console.log("Error at takePhoto to get Picture: " + error)
    });
  }

  selectPhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,

      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
      this.tempPhoto = imageData;
      this.profilePicture = normalizeURL(imageData);

      // this.uploadPhoto(imageData);
    }, error => {
      this.alert.show(error)
      // this.error = JSON.stringify(error);
      // console.log("Error at SelectPhoto to get Picture: " + error)
    });
  }

  uploadPhoto(imageFileUri: any) {

    this.upload(imageFileUri);
  }
  private upload(file: any) {
    this.loading.show();

    let options: FileUploadOptions = {
      params: {
        userid: this.shared.customerData.customers_id,
      },
      headers: { 'X-API-KEY': this.config.apiKeyValue },
      chunkedMode: false,
      fileKey: 'image',
      mimeType: "multipart/form-data"
    }

    this.transfer.upload(file, this.config.url + this.config.updateProfilePhoto, options)
      .then(data => {

        this.loading.hide();
        let res = JSON.parse(data.response);
        if (res.Status == true) {
          this.shared.showToast('Successfully updated profile photo.', 2000, 'bottom', 'success', () => {
            this.shared.customerData.customers_picture = res.Result[0].Photo;
            this.profileSelected = 'interests';
            this.isNotPicture = false;
          });
        }


      }, (error) => {
        this.loading.hide();
        var errMsg = '';
        if (error.status == 400) {
          errMsg = "Sorry, Update profile photo failed!";
        } else
          errMsg = 'Error while Updating!';
        this.shared.showToast(errMsg, 2000, 'bottom', 'error', () => {
        });

      });
  }

  ionViewWillEnter() {
    console.log(this.myAccountData, this.shared);
    this.myAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    this.myAccountData.customers_lastname = this.shared.customerData.customers_lastname;
    this.myAccountData.customers_email_address = this.shared.customerData.customers_email_address;
    this.profilePicture = this.config.url + this.config.userUploads + this.shared.customerData.customers_picture;
    this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    this.myAccountData.customers_telephone = this.shared.customerData.customers_telephone;
    this.myAccountData.customers_governorate = this.shared.customerData.customers_governorate;
    this.myAccountData.customers_city = this.shared.customerData.customers_city;
    this.myAccountData.customers_age = this.shared.customerData.customers_age;
    this.myAccountData.gender = this.shared.customerData.gender;
    this.isNotData = (this.shared.customerData.customers_firstname == "" || this.shared.customerData.customers_email_address == "" || this.shared.customerData.customers_telephone == "" || this.shared.customerData.customers_age == "");
    this.isNotPicture = (this.shared.customerData.customers_picture == "" || this.shared.customerData.customers_picture == "default.png");


  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  private backButtonFunc(): void {
    // this.openCart();
    // do something 
  }
}
