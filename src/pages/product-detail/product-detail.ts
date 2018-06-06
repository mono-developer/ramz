// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ViewController,
  Events,
  Platform
} from "ionic-angular";
import { ConfigProvider } from "../../providers/config/config";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { SocialSharing } from "@ionic-native/social-sharing";
import { LoginPage } from "../login/login";
import { LoadingProvider } from "../../providers/loading/loading";
import { HttpClient } from "@angular/common/http";
import { Comments, ResultEntity } from "../../models/comments";
import { Status } from "../../models/status";
import { Storage } from "@ionic/storage";
import { ProductsPage } from "../products/products";
import { AddProductPage } from "../add-product/add-product";
import { AppVersion } from '@ionic-native/app-version';

// Define On Top
declare var HKVideoPlayer;

@Component({
  selector: "page-product-detail",
  templateUrl: "product-detail.html"
})
export class ProductDetailPage {
  public product;
  commentData = {
    userid: "",
    itemid: "",
    post: ""
  };
  attributes = [];
  selectAttribute = true;
  discount_price;
  product_price;
  comments = new Array();
  private company;
  private map: Map<string, string>;
  isVideo: boolean = false;
  thumbnailPath: string = this.config.companyImageURL + "1522920284cherry.jpg";
  @ViewChild("videoPlayer") mVideoPlayer: any;

  @ViewChild("videoPlayer")
  set content(content: ElementRef) {
    this.mVideoPlayer = content;
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    private http: HttpClient,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public events: Events,
    public storage: Storage,
    private socialSharing: SocialSharing,
    private appVersion: AppVersion,
    public plt: Platform
  ) {
    this.product = navParams.get("data");
    this.company = navParams.get("company");
    console.log('product', this.product);
    // console.log(this.product);
    this.discount_price = this.product.Price;
    this.product_price = this.product.Price;
    // HKVideoPlayer.play(config.companyImageURL + this.product.ItemPath);
    // this.product.BusinessProfileId
    events.subscribe("reload:productDetails", product => {
      this.product = product;
    });
    var att = {
      products_options_id: this.product.BusinessProfileId,
      products_options: this.product.ItemTitle,
      name: this.product.ItemDescription
    };
    this.attributes.push(att);
  }

  ionViewDidLoad() {
    this.map = new Map()
      .set("MOV", "MOV")
      .set("MP4", "MP4")
      .set("3GP", "3GP");
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(this.product.ItemPath)[1];
    if (this.map.has(ext.trim().toUpperCase() + "")) {
      let video = this.mVideoPlayer.nativeElement;
      video.src = this.config.companyImageURL + this.product.ItemPath;
      this.isVideo = true;
    } else {
      this.isVideo = false;
    }
  }

  ionViewWillEnter() {
    this.loadComments();
  }

  loadComments() {
    this.http
      .get<Comments>(
        this.config.url +
        this.config.getItemComments +
        this.product.BusinessProfileId
      )
      .subscribe(data => {
        if (
          data.Result != null &&
          data.Result != undefined &&
          data.Result.length > 0
        )
          for (let value of data.Result) {
            value.Photo =
              value.CompanyLogo != null && value.CompanyLogo != ""
                ? this.config.companyImageURL + value.CompanyLogo
                : this.config.userImageURL + value.UserPhoto;
            value.UserName =
              value.CompanyName != null && value.CompanyName != ""
                ? value.CompanyName
                : value.UserName;
            this.comments.push(value);
          }

        // console.log(data);
      });
  }

  share() {
    this.loading.autoHide(1000);
    this.socialSharing
      .share(
        this.product.products_name,
        this.product.products_name,
        this.config.url + this.product.products_image,
        this.product.products_url
      )
      .then(() => {
        // Success!
      })
      .catch(() => {
        // Error!
      });
  }

  public commentdata: string;

  openRequestPage() {
    this.navCtrl.push("RequestOrderPage", {
      companyInfo: this.company,
      item: this.product,
      isVideo: this.isVideo
    });
  }

  saveComment() {
    let formData: FormData = new FormData();
    if (!this.shared.isCompany)
      formData.append("userid", this.shared.customerData.customers_id);
    else formData.append("companyid", this.shared.customerData.customers_id);
    formData.append("itemid", this.product.BusinessProfileId);
    formData.append("post", this.commentdata);
    this.loading.show();
    let link = this.shared.isCompany
      ? this.config.saveCompanyComment
      : this.config.saveUserComment;
    this.http.post<Status>(this.config.url + link, formData).subscribe(
      data => {
        if (data.Status) {
          let comment = new ResultEntity();
          comment.Comment = this.commentdata;
          if (this.shared.isCompany)
            comment.Photo =
              this.config.companyImageURL +
              this.shared.customerData.customers_picture;
          else
            comment.Photo =
              this.config.userImageURL +
              this.shared.customerData.customers_picture;
          comment.UserName = this.shared.customerData.customers_firstname;
          comment.CreatedAt = "Now";
          if (this.comments == null || this.comments == undefined) {
            this.comments = new Array();
          }
          this.comments.push(comment);
          this.commentdata = "";
          this.loading.hide();
        }
      },
      error => {
        this.loading.hide();
        var errMsg = "";
        if (error.status == 400) {
          errMsg = "Update profie photo failed: \n";
          errMsg += JSON.parse(error._body).Message;
        } else errMsg = "Error while Updating!";
      }
    );
  }
  isFav(product) {
    this.storage
      .get(`product ${product.BusinessProfileId}`)
      .then(value => {
        if (value != null) {
          this.storage.remove(`product ${product.BusinessProfileId}`);
          product.favorite = false;
        } else {
          this.storage.set(`product ${product.BusinessProfileId}`, product);
          this.storage.get(`product ${product.BusinessProfileId}`).then(val => {
          });
          product.favorite = true;
        }
      })
      .catch(() => (product.favorite = false));
  }
  fav(product) {
    this.isFav(product);
  }

  whatsShare() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {

      this.socialSharing.shareViaWhatsApp(
        this.company.FaceBook,
        "",

        ""
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.shareViaWhatsApp(
          this.company.FaceBook,
          "",

          ""
        ).then(() => {
        }).catch(() => {
        });
      });
    }
  }

  deleteProduct(product) {
    let formData: FormData = new FormData();
    formData.append("itemid", this.product.BusinessProfileId);

    let confirmAlert = this.alertCtrl.create({
      title: "Delete Product",
      message: "Are you sure delete this product ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Ok",
          handler: () => {
            //TODO: Your logic hereionic
            // this.nav.push(DetailsPage, { message: data.message });
            this.loading.show();
            this.http
              .post<Status>(this.config.url + this.config.deleteitem, formData)
              .subscribe(
                data => {
                  if (data.Status) {
                    this.loading.hide();
                    this.events.publish("reload:products", Date.now());
                    this.viewCtrl.dismiss();
                  }
                },
                error => {
                  this.loading.hide();
                  var errMsg = "";
                  if (error.status == 400) {
                    errMsg = "delete product failed: \n";
                  } else errMsg = "Error while Updating!";
                }
              );
          }
        }
      ]
    });
    confirmAlert.present();
  }

  editProduct(product) {
    this.navCtrl.push(AddProductPage, { product: product });
  }
}
