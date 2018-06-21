import { Component, ChangeDetectorRef, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { ConfigProvider } from "../../providers/config/config";
import { Http, Headers, RequestOptions } from "@angular/http";
import {
  Platform,
  NavController,
  ToastController,
  ViewController,
  IonicPage,
  Content,
  NavParams,
  Events,
  AlertController
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { File, FileEntry } from "@ionic-native/file";
import { AlertProvider } from "../../providers/alert/alert";
import { LoadingProvider } from "../../providers/loading/loading";
import { SearchPage } from "../search/search";
import { LoadDataProvider } from "../../providers/load-data/load-data";
import { Home5Page } from "../home5/home5";
import { Keyboard } from "@ionic-native/keyboard";
import { Pkg } from "../../models/packages";
import { HttpClient } from "@angular/common/http";
import { PkgInfo } from "../../models/PkgDetails";
import { normalizeURL } from "ionic-angular";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from "@ionic-native/paypal";
import {
  FileUploadOptions,
  FileTransferObject,
  FileTransfer
} from "@ionic-native/file-transfer";

@IonicPage({
  priority: "high"
})
@Component({
  selector: "page-my-account",
  templateUrl: "payment.html"
})
export class PaymentPage {
  creditCard = {
    number: "",
    expirymonth: "",
    expiryyear: "",
    cvv: "",
    amount: "",
    companyid: "",
    packageid: "",
    description: "",
    duedate: "",
    cardHolderName: "",
    date: ""
  };
  profilePicture = "assets/img/camera-alt.svg";
  public tempPhoto: any = null;
  passwordData: { [k: string]: any } = {};
  profileSelected: string = "credit";
  isAndroid: boolean = false;
  langId: number;
  governorates: any;
  customersInterests: any = null;
  cities: any;
  selectedCategories: any[] = [];
  allCategories: any[] = this.shared.allCategories;
  parent: Pkg;
  pkgDetails: PkgInfo;
  isKeyboardHide: boolean = true;
  @ViewChild(Content) content: Content;
  private headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });
  paymentdata: any;
  paymentdetails: any;
  private transfer: FileTransferObject = this.fileTransfer.create();
  constructor(
    public http: HttpClient,
    private http2: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public translate: TranslateService,
    public platform: Platform,
    private camera: Camera,
    public navCtrl: NavController,
    private fileTransfer: FileTransfer,
    public alert: AlertController,
    private cf: ChangeDetectorRef,
    public loading: LoadingProvider,
    loadDataProvider: LoadDataProvider,
    private readonly file: File,
    private events: Events,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private payPal: PayPal
  ) {
    this.parent = this.navParams.get("pkg");
    this.pkgDetails = this.navParams.get("pkgDetails");

    keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyboardHide = false;
      setTimeout(() => {
        // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
        this.content.resize();
      }, 100);
    });

    keyboard.onKeyboardHide().subscribe(() => {
      this.isKeyboardHide = true;
      setTimeout(() => {
        // this to make sure that angular's cycle performed and the footer removed from the DOM before resizing
        this.content.resize();
      }, 100);
    });

    this.isAndroid = platform.is("android");
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

  makePayment() {
    // console.log("this.parent: " + JSON.stringify(this.parent))
    // console.log("this.pkgDetails: " + JSON.stringify(this.pkgDetails))
    let payPalEnvironment: string = this.config.payPalEnvironment;
    let payment = new PayPalPayment(
      this.parent.SubscriptionPrice,
      "USD",
      this.parent.PackageName,
      "sale"
    );
    this.payPal
      .init({
        PayPalEnvironmentProduction: this.config.payPalEnvironmentProduction,
        PayPalEnvironmentSandbox: this.config.payPalEnvironmentSandbox
      })
      .then(
        () => {
          console.log("After init");
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal
            .prepareToRender(
              payPalEnvironment,
              new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
              })
            )
            .then(
              () => {
                console.log("After prepareToRender");
                this.payPal.renderSinglePaymentUI(payment).then(
                  onSuccess => {
                    console.log(
                      "Successfully paid: " + JSON.stringify(onSuccess)
                    );
                    alert("Successfully paid: " + JSON.stringify(onSuccess));
                    // Successfully paid
                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                  },
                  onError => {
                    // Error or render dialog closed without being successful
                    console.log("onError Render: " + JSON.stringify(onError));
                    // alert('onError Render: ' + JSON.stringify(onError));
                  }
                );
              },
              onError => {
                // Error in configuration
                console.log("configuration Render: " + JSON.stringify(onError));
                // alert('configuration Render: ' + JSON.stringify(onError));
              }
            );
        },
        onError => {
          // Error in initialization, maybe PayPal isn't supported or something else
          console.log("initialization Render: " + JSON.stringify(onError));
          // alert('initialization Render: ' + JSON.stringify(onError));
        }
      );
  }

  isCategorySelected(catId) {
    if (
      this.customersInterests &&
      this.customersInterests.filter(
        ci => ci.InterestCategoryId == catId && ci.Status == 1
      ).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateCheckboxes() {
    var valid: boolean = false;
    if (this.allCategories.filter(c => c.checked == true).length > 0) {
      valid = true;
    }
    return valid;
  }

  segmentChanged() {
    this.cf.detectChanges();
  }

  //============================================================================================
  //function updating user information
  updateInfo = function () {
    this.loading.show();
    this.creditCard.companyid = this.shared.customerData.customers_id;
    var splitted = this.creditCard.date.split("-", 2);
    let formData: FormData = new FormData();
    formData.append("number", this.creditCard.number);
    if (splitted != undefined && splitted.length > 0)
      formData.append("expiryyear", splitted[0]);
    if (splitted != undefined && splitted.length > 1)
      formData.append("expirymonth", splitted[1]);
    formData.append("cvv", this.creditCard.cvv);
    formData.append("amount", this.parent.SubscriptionPrice);
    formData.append("companyid", this.creditCard.companyid);
    formData.append("packageid", this.parent.PackageId);
    formData.append(
      "description",
      this.shared.customerData.customers_firstname +
      "|" +
      this.shared.customerData.customers_email_address
    );
    formData.append("duedate", this.pkgDetails.DueDate);
    this.http
      .post(this.config.url + this.config.creditCard, formData)
      .subscribe(
        data => {
          this.loading.hide();
          if (data.Status == true) {
            let toast = this.toastCtrl.create({
              message: "your payment processed successfully.",
              cssClass: "success",
              position: "bottom" //'top', "middle", "bottom"
            });

            toast.present(toast);
            this.creditCard = {
              number: "",
              expirymonth: "",
              expiryyear: "",
              cvv: "",
              amount: "",
              companyid: "",
              packageid: "",
              description: "",
              duedate: "",
              cardHolderName: "",
              date: ""
            };

            this.http2
              .get(
                this.config.url +
                this.config.checkCompanyIsActive +
                this.shared.customerData.customers_id,
                { headers: this.headers }
              )
              .map(res => res.json())
              .subscribe(data2 => {
                if (
                  data2.Status == true &&
                  data2.Message == "Company is active"
                ) {
                  this.shared.customerData.isActive = "1";
                  this.shared.isActive = true;
                  this.events.publish("user:changed", Date.now());
                  toast.dismiss();
                } else {
                  this.shared.isActive = false;
                  this.alertDlg(
                    "your account will be activated as soon possible and will be notify you"
                  );
                }
              });
          }
        },
        error => {
          this.loading.hide();
          var errMsg = "";
          if (error.status == 400) {
            errMsg = "your payment process failed , please try again . \n";
            let errors = JSON.parse(error._body).Message;
            for (let key in errors) {
              errMsg += key + " : " + errors[key] + "! \n ";
            }
          } else errMsg = "your payment process failed .";
          this.shared.showToast(errMsg, 3000, "bottom", "error", () => {
            //console.log('Dismissed toast');
          });
        }
      );
    // }
  };

  alertDlg(message) {
    let alert = this.alert.create({
      message: message,
      buttons: [
        {
          text: "OK",
          handler: () => { }
        }
      ]
    });
    alert.present();
  }
  selectPhoto(): void {
    this.camera
      .getPicture({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        quality: 90,
        allowEdit: true,
        targetWidth: 100,
        targetHeight: 100,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: false,
        correctOrientation: true
      })
      .then(
        imageData => {
          this.profilePicture = normalizeURL(imageData);
          this.tempPhoto = imageData;
          // this.uploadPhoto(imageData);
        },
        error => {
          // this.error = JSON.stringify(error);
          console.log("Error at SelectPhoto to get Picture: " + error);
        }
      );
  }

  uploadPhoto(imageFileUri: any) {
    try {
      this.upload(imageFileUri);
    } catch (error) {
      console.log(error);
    }
  }
  private upload(file: any) {
    this.loading.show();

    let options: FileUploadOptions = {
      params: {
        companyid: this.shared.customerData.customers_id,
        packageid: this.parent.PackageId,
        price: this.parent.SubscriptionPrice
      },
      headers: { "X-API-KEY": this.config.apiKeyValue },
      chunkedMode: false,
      fileKey: "image",
      mimeType: "multipart/form-data"
    };

    this.transfer
      .upload(file, this.config.url + this.config.westernunion, options)
      .then(
        res => {
          this.loading.hide();
          let data = JSON.parse(res.response);
          if (data.Status == true) {
            let toast = this.toastCtrl.create({
              message: data.Message,
              cssClass: "success",
              position: "bottom" //'top', "middle", "bottom"
            });
            toast.present(toast);
            this.http2
              .get(
                this.config.url +
                this.config.checkCompanyIsActive +
                this.shared.customerData.customers_id,
                { headers: this.headers }
              )
              .map(res => res.json())
              .subscribe(data2 => {
                if (
                  data2.Status == true &&
                  data2.Message == "Company is active"
                ) {
                  this.shared.customerData.isActive = "1";
                  this.shared.isActive = true;
                  this.events.publish("user:changed", Date.now());
                } else {
                  this.alertDlg(
                    "your account will be activated as soon possible and will be notify you"
                  );
                }
                toast.dismiss();
              });
          } else {
            this.shared.showToast(data.Message, 3000, "bottom", "error", () => {
              //console.log('Dismissed toast');
            });
          }
        },
        error => {
          console.log(error);
          this.loading.hide();
          var errMsg = "";
          if (error.status == 400) {
            errMsg = "Sorry, payment failed: \n";
            errMsg += JSON.parse(error._body).Message;
          } else errMsg = "Error while payment!";
          // this.alert.show(errMsg);
          this.shared.showToast(errMsg, 1000, "bottom", "error", () => {
            //console.log('Dismissed toast');
          });
        }
      );
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
