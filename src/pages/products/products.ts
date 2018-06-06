// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  InfiniteScroll,
  Content,
  ActionSheetController,
  Slides,
  Events,
  ViewController
} from "ionic-angular";
import { ConfigProvider } from "../../providers/config/config";
import { Http } from "@angular/http";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { LoadingProvider } from "../../providers/loading/loading";
import { TranslateService } from "@ngx-translate/core";
// import { share } from 'rxjs/operator/share';

import { ProductResponse, CompanyInfo } from "../../models/Product";
import { HttpClient } from "@angular/common/http";
import { ItemsEntity } from "../../models/Product";
import { DomSanitizer } from "@angular/platform-browser";
import { Storage } from "@ionic/storage";
import { CompanyRatingPage } from "../company-rating/company-rating";
import { SharePage } from "../share/share";

@Component({
  selector: "page-products",
  templateUrl: "products.html"
})
export class ProductsPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  scrollTopButton = false;

  //@ViewChild(IonRange) priceRange: IonRange;
  products = new Array();
  selectedTab = "";
  categoryId = "";
  categoryName: String = "";

  page = 0;

  price = { lower: 0, upper: 500 };
  maxAmount = 500;
  side = "right";
  productView = "grid";
  item: ItemsEntity;
  rating: number = 0;
  totalView: String;
  image: any;
  private parent: CompanyInfo;
  private companyInfo: CompanyInfo;
  private companyId: string = null;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public loading: LoadingProvider,
    public translate: TranslateService,
    public http: HttpClient,
    public events: Events,
    private sanitization: DomSanitizer,
    public storage: Storage,
    public actionSheet: ActionSheetController
  ) {
    if (shared.dir == "rtl") this.side = "left";

    this.parent = this.navParams.get("subCategory");
    this.companyId = this.navParams.get("companyId");
    // if (this.navParams.get('id') != undefined) this.selectedTab = this.categoryId = this.navParams.get('CompanyModel');
    if (this.parent != undefined) this.totalView = this.parent.TotalViewed;
    // if (this.navParams.get('sortOrder') != undefined) this.sortOrder = this.navParams.get('sortOrder');
    this.loadProducts();
    events.subscribe("reload:products", time => {
      this.loadProducts();
    });
  }

  loadProducts() {
    if (this.parent != undefined && this.parent.CompanyId)
      this.getProducts(this.parent.CompanyId);
    else if (this.companyId != null) this.getProducts(this.companyId);
  }
  ionViewWillEnter() { }
  checkCompany(company) {
    this.storage
      .get("company " + company.CompanyId)
      .then(value => {
        // value ? product.favorite = true : product.favorite = false
        // console.log(value);
        if (value != undefined && value.length > 0) {
          this.storage.remove(`company ${company.CompanyId}`);
          company.isliked = false;
        } else {
          this.storage.set(`company ${company.CompanyId}`, company.CompnayName);
          company.isliked = true;
        }
      })
      .catch(() => (company.isliked = false));
  }

  getProducts(CompanyId) {
    if (this.page == 0) {
      this.loading.show();
    }

    this.http
      .get<ProductResponse>(this.config.url + "company/find/" + CompanyId)
      .subscribe(data => {
        // console.log(data.product_data.length + "   " + this.page);
        if (this.page == 0) {
          this.products = new Array();
          this.loading.hide();
          this.scrollToTop();
        }
        if (data.Status) {
          if (this.parent == null || this.parent == undefined)
            this.parent = data.Result.CompanyInfo;
          this.page++;
          for (var key in data.Result.Items) {
            if (this.isFav(data.Result.Items[key])) {
              data.Result.Items[key].favorite = true;
            } else {
              data.Result.Items[key].favorite = false;
            }
          }
          this.products = data.Result.Items;
          this.categoryName = data.Result.CompanyInfo.CategoryEnglish;
          this.companyInfo = data.Result.CompanyInfo;
          this.image = this.sanitization.bypassSecurityTrustStyle(
            `url(${this.config.companyImageURL +
            data.Result.CompanyInfo.Banner})`
          );

          this.rating = parseInt(data.Result.CompanyInfo.Rating);
        }
        this.loading.hide();
      });
  }

  isFav(product) {
    this.storage
      .get("product " + product.BusinessProfileId)
      .then(value => {
        value ? (product.favorite = true) : (product.favorite = false);
      })
      .catch(() => (product.favorite = false));
  }

  //============================================================================================
  // filling filter array for keyword search
  fillFilterArray = function (fValue, fName, keyword) {
    if (fValue._value == true) {
      this.selectedFilters.push({ name: fName, value: keyword });
    } else {
      this.selectedFilters.forEach((value, index) => {
        if (value.value == keyword) {
          this.selectedFilters.splice(index, 1);
        }
      });
    } //console.log(this.selectedFilters);
  };
  //============================================================================================
  //getting countries from server
  getFilters = function (id) {
    var data: { [k: string]: any } = {};
    data.categories_id = id;
    data.language_id = this.config.langId;
    this.http
      .post(this.config.url + "getFilters", data)
      .map(res => res.json())
      .subscribe(data => {
        //  console.log(data);
        if (data.success == 1) this.filters = data.filters;
        this.maxAmount = this.price.upper = data.maxPrice;
      });
  };

  ionViewDidEnter() {
    //this.product = this.navParams.get('data');
  }
  ngOnChanges() { }

  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }

  openRequestPage() {
    this.navCtrl.push("NewOrderPage", { companyInfo: this.companyInfo });
  }

  openAddProduct() {
    this.navCtrl.push("AddProductPage", { companyInfo: this.companyInfo });
  }

  openRatingPage() {
    this.navCtrl.push(CompanyRatingPage, { companyInfo: this.companyInfo });
  }

  openSharePage() {
    this.navCtrl.push(SharePage, { companyInfo: this.companyInfo });
  }
  onScroll(e) {
    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
    //else this.scrollTopButton=false;
    //   console.log(e);
  }

  ionViewDidLoad() {
    // console.log("loaded");
    try {
      setTimeout(() => {
        let ind = 0;
        this.shared.subCategories.forEach((value, index) => {
          if (this.selectedTab == value.id) {
            ind = index;
          }
        });
        // this.slides.slideTo(ind, 1000, true);
      }, 100);
    } catch (error) { }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
