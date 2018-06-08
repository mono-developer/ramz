
import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavParams,
  ToastController,
  Events
} from "ionic-angular";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { TranslateService } from "@ngx-translate/core";
import { LoadDataProvider } from "../../providers/load-data/load-data";
import { Http, Headers } from "@angular/http";
import { ConfigProvider } from "../../providers/config/config";
import { HttpClient } from "@angular/common/http";
import { LoadingProvider } from "../../providers/loading/loading";
import { Status } from "../../models/status";
import { CompanyInfo, ItemsEntity } from "../../models/Product";
import { Camera } from "@ionic-native/camera";
import { File, FileEntry } from "@ionic-native/file";
import { normalizeURL } from "ionic-angular";
import {
  FileUploadOptions,
  FileTransferObject,
  FileTransfer
} from "@ionic-native/file-transfer";
import { FileChooser } from "@ionic-native/file-chooser";

@IonicPage({
  priority: "high"
  // segment: `home-page`
})
@Component({
  selector: "add-product",
  templateUrl: "add-product.html"
})
export class AddProductPage {
  private transfer: FileTransferObject = this.fileTransfer.create();
  data = {
    companyid: "",
    price: "",
    item: "",
    itemtitle: "",
    itemdescription: ""
  };
  videoId: any;
  companyInfo: CompanyInfo;
  item: ItemsEntity;
  profilePicture = "assets/img/1.svg";
  public tempPhoto: any = null;
  constructor(
    public viewCtrl: ViewController,
    loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public http: HttpClient,
    public navParams: NavParams,
    private readonly file: File,
    private camera: Camera,
    public toastCtrl: ToastController,
    private events: Events,
    private fileTransfer: FileTransfer,
    public fileChooser: FileChooser,
    translate: TranslateService
  ) {
    let request = this.navParams.get("request");
    this.companyInfo = this.navParams.get("companyInfo");
    this.item = this.navParams.get("product");
    if (this.item) this.fillData();
  }

  fillData() {
    if (this.item) {
      this.profilePicture = this.config.companyImageURL + this.item.ItemPath;
      this.data.itemtitle = this.item.ItemTitle;
      this.data.price = this.item.Price;
      this.companyInfo = new CompanyInfo();
      this.companyInfo.CompanyId = this.item.CompanyId;
      this.data.itemdescription = this.item.ItemDescription;
      this.tempPhoto = null;
    }
  }
  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  convertToBase64(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        let canvas = <HTMLCanvasElement>document.createElement("CANVAS"),
          ctx = canvas.getContext("2d"),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }

  getVideo() {
    this.fileChooser
      .open()
      .then(uri => {
        this.tempPhoto = uri;
      })
      .catch(e => console.log(e));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectPhoto(): void {
    this.camera
      .getPicture({
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: this.camera.MediaType.ALLMEDIA
      })
      .then(
        imageData => {
          this.tempPhoto = imageData;
          this.profilePicture = normalizeURL(imageData);
          if (this.shared.isVideo(this.profilePicture)) {
            this.profilePicture = "assets/img/video-camera.svg";
          }
        },
        error => {
          // this.error = JSON.stringify(error);
          console.log("Error at SelectPhoto to get Picture: " + error);
        }
      );
  }

  uploadPhoto(imageFileUri: any) {
    if (this.item && this.tempPhoto == null) {
      this.send();
    } else this.upload(imageFileUri);
  }
  private upload(file: any) {
    this.loading.show();
    let options: FileUploadOptions = {
      params: {
        companyid: this.companyInfo.CompanyId,
        price: this.data.price,
        itemtitle: this.data.itemtitle,
        itemdescription: this.data.itemdescription,
        businessprofileid: this.item ? this.item.BusinessProfileId : null,
        isavailable: this.item ? 1 : null
      },
      headers: { "X-API-KEY": this.config.apiKeyValue },
      chunkedMode: false,
      fileKey: "item",
      fileName: this.tempPhoto,
      mimeType: "multipart/form-data"
    };
    let customURL = this.item ? this.config.updateitem : this.config.addProduct;
    this.transfer
      .upload(this.tempPhoto, this.config.url + customURL, options)
      .then(
        data => {
          this.loading.hide();
          let res = JSON.parse(data.response);
          if (res.Status == true) {
            this.loading.hide();
            if (this.item) {
              this.item.ItemTitle = this.data.itemtitle;
              this.item.Price = this.data.price;
              this.item.CompanyId = this.companyInfo.CompanyId;
              this.item.ItemDescription = this.data.itemdescription;
              if (this.tempPhoto != null) this.item.ItemPath = this.tempPhoto;

              this.events.publish("reload:productDetails", this.item);
            }

            this.events.publish("reload:products", Date.now());
            this.shared.showToast(
              "Successfully add product",
              2000,
              "bottom",
              "success",
              () => {
                this.dismiss();
              }
            );
          }
        },
        error => {
          console.log(error);
          this.loading.hide();
          var errMsg = "";
          errMsg = "add product failed.";
          this.shared.showToast(errMsg, 2000, "bottom", "error", () => { });
        }
      );
  }

  send() {
    this.loading.show();
    if (this.item) {
      this.item.ItemTitle = this.data.itemtitle;
      this.item.Price = this.data.price;
      this.item.CompanyId = this.companyInfo.CompanyId;
      this.item.ItemDescription = this.data.itemdescription;
    }
    let formData: FormData = new FormData();
    formData.append("businessprofileid", this.item.BusinessProfileId);
    formData.append("price", this.item.Price);
    formData.append("itemtitle", this.item.ItemTitle);
    formData.append("isavailable", "1");
    formData.append("itemdescription", this.item.ItemDescription);
    this.http
      .post(this.config.url + this.config.updateitem, formData)
      .subscribe(
        data => {
          this.loading.hide();
          // if (data.Status == true) {
          this.events.publish("reload:productDetails", this.item);
          this.shared.showToast(
            "Successfully update product",
            2000,
            "bottom",
            "success",
            () => {
              this.dismiss();
            }
          );
        },
        error => {
          console.log(error);
          this.loading.hide();
          var errMsg = "";
          errMsg = "add product failed.";
          this.shared.showToast(errMsg, 2000, "bottom", "error", () => { });
        }
      );
  }
}
