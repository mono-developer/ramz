// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { Platform, NavController, ToastController, ViewController, LoadingController, MenuController, Content } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from "@ionic-native/file";
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { SearchPage } from '../search/search';
import { LoadDataProvider } from '../../providers/load-data/load-data';
import { Home5Page } from '../home5/home5';
import { normalizeURL } from 'ionic-angular';
import { FileUploadOptions, FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-company-account',
  templateUrl: 'company-account.html',
})
export class CompanyAccountPage {
  companyAccountData = {
    customers_firstname: '',
    customers_email_address: '',
    currentPassword: '',
    customers_password: '',
    customers_telephone: '',
    customers_governorate: '',
    customers_city: '',
    customers_dob: '',
    customers_old_picture: '',
    customers_owner_name: '',
    customers_busines_title: '',
    customers_category_id: '',
    customers_commercial_record: '',
    customers_address: '',
    customers_faceBook: '',
    customers_twitter: '',
    customers_instagram: '',
    customers_description: '',
    Latitude: '',
    Longitude: '',
    // customers_picture
    //customers_banner
    //customers_id
  };

  profileLogo = 'assets/img/camera-alt.svg';
  profileBanner = 'assets/img/camera-alt.svg';
  isNotData: boolean = true;
  isNotLogo: boolean = true;
  isNotBanner: boolean = true;
  isNotMap: boolean = true;
  public tempLogoPhoto: any = null;
  public tempBannnerPhoto: any = null;
  passwordData: { [k: string]: any } = {};
  profileSelected: string = "address";
  isAndroid: boolean = false;
  langId: number;
  governorates: any;
  cities: any;
  selectedCategories: any[] = [];
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
    loadDataProvider: LoadDataProvider,
    private readonly file: File,
    public toastCtrl: ToastController,
    private fileTransfer: FileTransfer,
    public loadCtrl: LoadingController,
    public loading: LoadingProvider,
    public viewCtrl: ViewController,
    private menu: MenuController,
    private storage: Storage,
    private keyboard: Keyboard) {

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


    this.isAndroid = platform.is('android');
    this.langId = localStorage.langId;
    this.storage.get('isLogged').then((val) => {
      if (val != null && val != undefined && val == true && shared.isActive && shared.isCompany)
        this.menu.enable(true);
      else
        this.menu.enable(false);
    });

    // TODO: show progress
    loadDataProvider.getGovernorates().then(data => {
      // TODO: turn off menu load json progress

      // data after proccessed.
      this.governorates = data;
    }, err => console.log(err));
  }

  getCities(goverId) {
    this.http.get(this.config.url + this.config.getCities + goverId, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.cities = data.Result;
        // return Promise.resolve(data.Result);
      });
  }

  segmentChanged() {
    this.cf.detectChanges();
  }

  //============================================================================================  
  //function updating Profile Address 
  updateProfileAddress = function () {
    this.loading.show();
    this.companyAccountData.customers_id = this.shared.customerData.customers_id;

    let formData: FormData = new FormData();
    formData.append('businesscategory', this.companyAccountData.customers_category_id);
    formData.append('city', this.companyAccountData.customers_city);
    formData.append('companyname', this.companyAccountData.customers_firstname);
    formData.append('commercialrecord', this.companyAccountData.customers_commercial_record);
    formData.append('businesstitle', this.companyAccountData.customers_busines_title);
    formData.append('ownername', this.companyAccountData.customers_owner_name);
    formData.append('mobile', this.companyAccountData.customers_telephone);
    formData.append('emailaddress', this.companyAccountData.customers_email_address);
    formData.append('addressline', this.companyAccountData.customers_address);
    formData.append('twitter', this.companyAccountData.customers_twitter);
    formData.append('instagram', this.companyAccountData.customers_instagram);
    formData.append('facebook', this.companyAccountData.customers_faceBook);
    formData.append('businessdescription', this.companyAccountData.customers_description);
    formData.append('companyid', this.companyAccountData.customers_id);

    console.log(formData);

    this.http.post(this.config.url + this.config.updateProfileaddress, formData, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          let userData = data.Result;
          this.shared.customerData.customers_id = userData.CompanyId;
          this.shared.customerData.customers_category_id = userData.CategoryId;
          this.shared.customerData.customers_package_id = userData.PackageId;
          this.shared.customerData.customers_city = userData.CityId;
          this.shared.customerData.customers_firstname = userData.CompnayName;
          this.shared.customerData.customers_commercial_record = userData.CommercialRecord;
          this.shared.customerData.customers_busines_title = userData.BusinesTitle;
          this.shared.customerData.customers_owner_name = userData.OwnerName;
          this.shared.customerData.customers_email_address = userData.EmailAddress;
          this.shared.customerData.customers_telephone = userData.Mobile;
          this.shared.customerData.customers_picture = userData.Logo;
          this.shared.customerData.customers_banner = userData.Banner;
          this.shared.customerData.customers_address = userData.Address;
          this.shared.customerData.customers_faceBook = userData.FaceBook;
          this.shared.customerData.customers_twitter = userData.Twitter;
          this.shared.customerData.customers_instagram = userData.Instagram;
          this.shared.customerData.customers_description = userData.Description;
          this.shared.customerData.customers_device_type = userData.DeviceType;
          this.shared.customerData.customers_token = userData.Token;
          this.shared.customerData.customers_notification = userData.Notification;
          this.shared.customerData.customers_total__viewed = userData.TotalViewed;
          this.shared.customerData.customers_is_active = userData.IsActive;
          this.shared.customerData.customers_package_expires = userData.PackageExpires;
          this.shared.customerData.customers_created_at = userData.CreatedAt;
          if (userData.Password != '')
            this.shared.customerData.customers_password = userData.Password;

          this.shared.login(this.shared.customerData);
          this.shared.showToast(this.langId && this.langId == 1 && data.Arabic ? data.Arabic : data.Message, 2000, 'bottom', 'success', () => {
            //console.log('Dismissed toast');
            this.profileSelected = 'banner';
            this.isNotData = false;
          });
        }
      }
        , error => {
          this.loading.hide();
          var errMsg = '';
          if (error.status == 400) {
            if (this.langId && this.langId == 1)
              errMsg = "Sorry, Update company profie data failed! Please check your inputs."
            else {
              errMsg = "Sorry, Update company profie data failed: ";
              let errors = JSON.parse(error._body).Message;
              for (let key in errors) {
                errMsg += (key + " : " + errors[key] + "!  ");
              }
            }
          } else
            errMsg = 'Error while Updating!';

          this.shared.showToast(errMsg, 2000, 'bottom', 'error', () => {
            //console.log('Dismissed toast');
          });
        });
    // }
  }

  updateMap = function () {
    let customers_id = this.shared.customerData.customers_id;
  }


  updatePhoto = function () {
    this.loading.show();
    this.companyAccountData.customers_id = this.shared.customerData.customers_id;

    if (this.profileLogo == this.config.url + this.config.userUploads + this.shared.customerData.customers_picture) {
      // console.log("old picture");
      // this.companyAccountData.customers_picture=$rootScope.customerData.customers_picture;
      this.companyAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    }
    else if (this.profileLogo == '')
      this.companyAccountData.customers_picture = null;
    else
      this.companyAccountData.customers_picture = this.profileLogo;

    // var data = this.companyAccountData;
    // console.log("post customers_picture  " + this.companyAccountData.customers_picture);
    let formData: FormData = new FormData();
    formData.append('userid', this.companyAccountData.customers_id);
    formData.append('image', this.companyAccountData.customers_picture);

    this.http.post(this.config.url + this.config.updateProfilephoto, formData, { headers: this.headers }).map(res => res.json()).subscribe(data => {

      this.loading.hide();
      if (data.Status == true) {
        //   document.getElementById("updateForm").reset();
        this.alert.show(this.langId && this.langId == 1 && data.Arabic ? data.Arabic : data.Message);
        // this.shared.customerData.customers_picture = data.data[0].customers_picture;
        this.shared.customerData.customers_picture = data.Result.Photo;
        this.shared.login(this.shared.customerData);
      }
    }
      , error => {
        this.loading.hide();
        var errMsg = '';
        if (error.status == 400) {
          if (this.langId && this.langId == 1)
            errMsg = "Sorry, Update profile photo failed!";
          else {
            errMsg = "Update profie photo failed: \n";
            // console.log("error: " + error)
            // console.log("errMsg1: " + JSON.parse(error._body).Message)
            errMsg += JSON.parse(error._body).Message;
            // console.log("errMsg2: " + errMsg)
          }

        } else
          errMsg = 'Error while Updating!';

        this.errorMessage = errMsg
        this.alert.show(errMsg);
      });
    // }
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.platform.ready().then(() => {
      this.camera.getPicture(options).then((imageData) => {
        // this.profileLogo = 'data:image/jpeg;base64,' + imageData;
        this.profileLogo = normalizeURL(imageData);
      }, (err) => {
        console.log("Error at openCamera to get Picture: " + err)
      });
    });
  }

  takePhoto(profilePicture, tempPhoto, type) {
    this.camera.getPicture({
      quality: 100,
      allowEdit: true,
      targetWidth: 700,
      targetHeight: 500,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
      // this.profileLogo = normalizeURL(imageData);
      // this.tempLogoPhoto = imageData;
      profilePicture = normalizeURL(imageData);
      tempPhoto = imageData;
      if (type == 'banner') {
        this.profileBanner = normalizeURL(imageData);
        this.tempBannnerPhoto = imageData;
      }
      else if (type == 'logo') {
        this.profileLogo = normalizeURL(imageData);
        this.tempLogoPhoto = imageData;
      }
      //this.uploadPhoto(imageData);
    }, error => {
      // this.error = JSON.stringify(error);
      console.log("Error at takePhoto to get Picture: " + error)
    });
  }

  selectPhoto(profilePicture, tempPhoto, type): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      allowEdit: true,
      targetWidth: 700,
      targetHeight: 500,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {

      tempPhoto = imageData;
      if (type == 'banner') {
        this.profileBanner = normalizeURL(imageData);
        this.tempBannnerPhoto = imageData;
      }
      else if (type == 'logo') {
        this.profileLogo = normalizeURL(imageData);
        this.tempLogoPhoto = imageData;
      }

      // this.uploadPhoto(imageData);
    }, error => {
      // this.error = JSON.stringify(error);
      console.log("Error at Select Photo to get Picture: " + error)
    });
  }

  uploadPhoto(imageFileUri: any, type: string): void {

    this.upload(imageFileUri, type);
  }

  private upload(file: any, type: string) {

    let transfer: FileTransferObject = this.fileTransfer.create();
    let key = '';
    if (type == 'banner')
      key = 'banner';
    else
      key = 'logo';
    let options: FileUploadOptions = {
      params: {
        companyid: this.shared.customerData.customers_id,
      },
      headers: { 'X-API-KEY': this.config.apiKeyValue },
      chunkedMode: false,
      fileKey: key,
      mimeType: "multipart/form-data"
    }
    var subUrl;
    if (type == 'banner')
      subUrl = this.config.updateProfileBanner;
    else
      subUrl = this.config.updateProfileLogo;

    let loader = this.loadCtrl.create({
      content: 'Uploading ' + type + ' photo...',
    });
    loader.present().then(() => {
      transfer.upload(file, this.config.url + subUrl, options)
        .then(data => {
          loader.dismiss();
          let obj = JSON.parse(data.response)
          if (obj.Status) {
            //   document.getElementById("updateForm").reset();
            // this.alert.show(data.Message);
            if (type == 'banner') {
              this.shared.customerData.customers_banner = obj.Result.Photo;
              this.tempBannnerPhoto = null;
            }

            else if (type == 'logo') {
              this.shared.customerData.customers_picture = obj.Result.Photo;
              this.tempLogoPhoto = null;
            }


            this.shared.login(this.shared.customerData);
            this.shared.showToast('Successfully update profile photo.', 2000, 'bottom', 'success', () => {
              //console.log('Dismissed toast');
              if (type == 'banner') {
                this.profileSelected = 'logo';
                this.isNotBanner = false;
                this.isNotMap = false;
              } else if (type == 'logo') {
                this.profileSelected = 'map';
                this.isNotLogo = false;

              }
            });
          }
        }, (error) => {
          loader.dismiss();
          var errMsg = '';
          if (error.status == 400) {
            if (this.langId && this.langId == 1)
              errMsg = "Sorry, Update profile photo failed!";
            else {
              errMsg = "Sorry, Update profie photo failed: \n";
              errMsg += JSON.parse(error._body).Message;
              // console.log("errMsg2: " + errMsg)
            }
          } else
            errMsg = 'Error while Updating!';
          // this.alert.show(errMsg);
          this.shared.showToast(errMsg, 2000, 'bottom', 'error', () => {
            //console.log('Dismissed toast');
          });
        });

    });
  }

  ionViewWillEnter() {
    this.companyAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    this.companyAccountData.customers_email_address = this.shared.customerData.customers_email_address;
    this.profileLogo = this.config.url + this.config.companyUploads + this.shared.customerData.customers_picture;
    this.profileBanner = this.config.url + this.config.companyUploads + this.shared.customerData.customers_banner;
    this.companyAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    this.companyAccountData.customers_telephone = this.shared.customerData.customers_telephone;
    this.companyAccountData.customers_category_id = this.shared.customerData.customers_category_id;
    this.companyAccountData.customers_governorate = this.shared.customerData.customers_governorate;
    this.companyAccountData.customers_city = this.shared.customerData.customers_city;
    this.companyAccountData.customers_commercial_record = this.shared.customerData.customers_commercial_record;
    this.companyAccountData.customers_owner_name = this.shared.customerData.customers_owner_name;
    this.companyAccountData.customers_busines_title = this.shared.customerData.customers_busines_title;
    this.companyAccountData.customers_address = this.shared.customerData.customers_address;
    this.companyAccountData.customers_faceBook = this.shared.customerData.customers_faceBook;
    this.companyAccountData.customers_twitter = this.shared.customerData.customers_twitter;
    this.companyAccountData.customers_instagram = this.shared.customerData.customers_instagram;
    this.companyAccountData.customers_description = this.shared.customerData.customers_description;

    // this.platform.registerBackButtonAction(() => this.backButtonFunc());
    this.isNotData = (this.shared.customerData.customers_address == "" || this.shared.customerData.customers_commercial_record == "" || this.shared.customerData.customers_owner_name == "" || this.shared.customerData.customers_busines_title == "");
    this.isNotLogo = (this.shared.customerData.customers_picture == "" || this.shared.customerData.customers_picture == "logo-default.png");
    this.isNotBanner = (this.shared.customerData.customers_banner == "" || this.shared.customerData.customers_banner == "banner-default.png");
    this.isNotMap = (this.shared.customerData.Latitude == "" || this.shared.customerData.Longitude == "");
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

  ionViewDidLoad() {

  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    // this.platform.ready().then(() => {
    //   this.loadMap();
    // });
  }




}
