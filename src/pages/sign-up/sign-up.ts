import { Component } from "@angular/core";
import {
  ViewController,
  ModalController,
  NavController,
  ToastController,
  App
} from "ionic-angular";
import { LoadingProvider } from "../../providers/loading/loading";
import { ConfigProvider } from "../../providers/config/config";
import { Http, Headers } from "@angular/http";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Platform } from "ionic-angular";
import { LoginPage } from "../login/login";
import { LoadDataProvider } from "../../providers/load-data/load-data";
import { GreatingPage } from "../greating/greating";
import { PrivacyPolicyPage } from "../privacy-policy/privacy-policy";

@Component({
  selector: "page-sign-up",
  templateUrl: "sign-up.html",
  providers: [LoadDataProvider]
})
export class SignUpPage {
  formData = {
    customers_firstname: "",
    // customers_lastname: '',
    customers_email_address: "",
    customers_password: "",
    customers_confirmed_password: "",
    customers_telephone: "",
    customers_governorate: "",
    customers_city: "",
    customers_age: "",
    customers_agree: false,
    customers_picture: "",
    gender: ""
  };
  image;
  errorMessage = "";
  notifyMessage = "";
  governorates: any;
  cities: any;
  customerType = this.shared.customerType;
  langId: number;

  private headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public platform: Platform,
    private camera: Camera,
    loadDataProvider: LoadDataProvider,
    public toastCtrl: ToastController,
    public app: App
  ) {
    this.langId = localStorage.langId;
    // TODO: show progress
    loadDataProvider.getGovernorates().then(
      data => {
        // TODO: turn off menu load json progress

        // data after proccessed.
        this.governorates = data;
      },
      err => console.log(err)
    );
  }

  getCities(goverId) {
    this.http
      .get(this.config.url + this.config.getCities + goverId, {
        headers: this.headers
      })
      .map(res => res.json())
      .subscribe(data => {
        this.cities = data.Result;
        // return Promise.resolve(data.Result);
      });
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.platform.ready().then(() => {
      this.camera.getPicture(options).then(
        imageData => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
          this.image = "data:image/jpeg;base64," + imageData;
          // console.log(base64Image);
        },
        err => { }
      );
    });
  }

  signUp() {
    this.loading.show();
    this.errorMessage = "";
    this.notifyMessage = "";
    // this.formData.customers_picture = this.image;
    let formData: FormData = new FormData();
    formData.append("cityid", this.formData.customers_city);
    formData.append("password", this.formData.customers_password);
    formData.append("email", this.formData.customers_email_address);
    formData.append("mobile", this.formData.customers_telephone);
    formData.append("name", this.formData.customers_firstname);
    formData.append("age", this.formData.customers_age);
    formData.append("gender", this.formData.gender);
    formData.append("device", this.config.deviceType);
    formData.append("token", this.shared.token);
    this.http
      .post(this.config.url + this.config.processRegistration, formData, {
        headers: this.headers
      })
      .map(res => res.json())
      .subscribe(
        data => {
          this.loading.hide();
          if (data.Status == true) {
            // this.notifyMessage = data.Message;
            let userData = data.Result;
            let customerData = {
              customers_id: userData.UserId,
              customers_firstname: userData.Name,
              customers_lastname: userData.LastName || "",
              customers_email_address: userData.Email,
              customers_password: userData.Password || "",
              customers_telephone: userData.Mobile,
              customers_governorate: userData.GovernorateId || "",
              customers_city: userData.CityId,
              customers_age: userData.Age,
              customers_picture: userData.Photo,
              customers_device_type: userData.DeviceType,
              customers_token: userData.Token,
              customers_notification: userData.Notification,
              gender: userData.Gender
            };
            this.shared.login(customerData);
            this.shared.registerDevice(customerData.customers_id);
            //this.config.customerData = data.data[0];
            // this.viewCtrl.dismiss();
            //GreatingPage
            this.shared.showToast(this.langId && this.langId == 1 ? data.Arabic : data.Message, 2000, "top", "success", () => {
              //console.log('Dismissed toast');
              this.viewCtrl.dismiss();
              this.app.getRootNavs()[0].setRoot("GreatingPage");
            });
          }
          if (data.Status == false) {
            // this.errorMessage = data.message;
            // this.errorMessage = "Sign up failed!";
            this.shared.showToast(
              "Sign up failed! Please check your inputs.",
              3000,
              "top",
              "error",
              () => {
                //console.log('Dismissed toast');
              }
            );
          }
        },
        err => {
          this.loading.hide();
          var errMsg = "";
          if (err.status == 406) errMsg = "Sign up failed! User exists.";
          else if (err.status == 401) errMsg = "Sign up failed!";
          else if (err.status == 400) {
            if (this.langId && this.langId == 1)
              errMsg = "Sign up failed! Please check your inputs."
            else {
              let errors = JSON.parse(err._body).Message;
              for (let key in errors) {
                errMsg += key + " : " + errors[key] + ". \n ";
              }
            }
          } else errMsg = "Server error!";

          // this.errorMessage = errMsg
          // console.log("errMsg : ", errMsg)
          this.shared.showToast(errMsg, 3000, "top", "error", () => {
            //console.log('Dismissed toast');
          });
        }
      );
  }

  companySignUp() {
    this.loading.show();
    let formData: FormData = new FormData();
    formData.append("password", this.formData.customers_password);
    formData.append("email", this.formData.customers_email_address);
    formData.append("mobile", this.formData.customers_telephone);
    formData.append("companyname", this.formData.customers_firstname);
    formData.append("devicetype", this.config.deviceType);
    formData.append("token", this.shared.token);
    this.http
      .post(
        this.config.url + this.config.processCompanyRegistration,
        formData,
        { headers: this.headers }
      )
      .map(res => res.json())
      .subscribe(
        data => {
          this.loading.hide();
          if (data.Status == true) {
            // this.notifyMessage = data.Message;
            let userData = data.Result;
            let customerData = {
              customers_id: userData.CompanyId,
              customers_firstname: userData.CompnayName,
              customers_lastname: userData.LastName || "",
              customers_email_address: userData.EmailAddress,
              customers_password: userData.Password || "",
              customers_telephone: userData.Mobile,

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
              customers_created_at: userData.CreatedAt
            };
            this.shared.login(customerData);
            this.shared.registerDevice(customerData.customers_id);

            //this.config.customerData = data.data[0];
            // this.viewCtrl.dismiss();
            //GreatingPage
            this.shared.showToast(this.langId && this.langId == 1 ? data.Arabic : data.Message, 2000, "top", "success", () => {
              //console.log('Dismissed toast');
              this.viewCtrl.dismiss();
              this.app.getRootNavs()[0].setRoot("GreatingPage");
            });
          }
          if (data.Status == false) {
            // this.errorMessage = data.message;
            // this.errorMessage = "Sign up failed!";
            this.shared.showToast(
              "Sign up failed!",
              3000,
              "top",
              "error",
              () => {
                //console.log('Dismissed toast');
              }
            );
          }
        },
        err => {
          this.loading.hide();
          var errMsg = "";
          if (err.status == 406) errMsg = "Sign up failed! User exists.";
          else if (err.status == 401) errMsg = "Sign up failed!";
          else if (err.status == 400) {

            if (this.langId && this.langId == 1)
              errMsg = "Sign up failed! Please check your inputs."
            else {
              let errors = JSON.parse(err._body).Message;
              if (typeof errors === "string") {
                errMsg = errors;
              } else {
                for (let key in errors) {
                  errMsg += key + " : " + errors[key] + ". \n ";
                }
              }
            }
          } else errMsg = "Server error";

          // this.errorMessage = errMsg
          //console.log("errMsg : ",errMsg )
          this.shared.showToast(errMsg, 3000, "top", "error", () => {
            //console.log('Dismissed toast');
          });
        }
      );
  }

  openGreating() {
    // this.navCtrl.push(GreatingPage);
    this.app.getRootNavs()[0].setRoot("GreatingPage");
  }

  openPrivacyPolicyPage() {
    // console.log("Call PrivacyPolicyPage");
    // let modal = this.modalCtrl.create(PrivacyPolicyPage)
    // modal.present();
    this.navCtrl.push(PrivacyPolicyPage);
  }
  openTermServicesPage() {
    let modal = this.modalCtrl.create("TermServicesPage");
    modal.present();
  }
  openRefundPolicyPage() {
    let modal = this.modalCtrl.create("RefundPolicyPage");
    modal.present();
  }
  dismiss() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignUpPage');
  // }
}
