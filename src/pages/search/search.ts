// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { ConfigProvider } from "../../providers/config/config";
import { Http, Headers } from "@angular/http";
import { AlertProvider } from "../../providers/alert/alert";
import { LoadingProvider } from "../../providers/loading/loading";
import { SharedDataProvider } from "../../providers/shared-data/shared-data";
import { ProductsPage } from "../products/products";
import { LoadDataProvider } from "../../providers/load-data/load-data";
import { Content } from "ionic-angular";

@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage {
  search;
  searchResult = [];
  limitPerPage = 10;
  pageNo = 1;
  governorates: any;
  cities: any;
  allCategories: any[] = this.shared.allCategories;
  categoryId = "";
  governorateId = "";
  cityId = "";
  isLookup: boolean = false;

  private headers = new Headers({ "X-API-KEY": this.config.apiKeyValue });
  @ViewChild(Content) content: Content;

  scrollTopButton = false;
  totalPages: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public toastCtrl: ToastController,
    public loadDataProvider: LoadDataProvider
  ) {
    loadDataProvider.getGovernorates().then(
      data => {
        this.governorates = data;
      },
      err => console.log(err)
    );
  }

  getCities(goverId) {
    this.cityId = "";
    this.loadDataProvider.getCities(goverId).then(
      data => {
        this.cities = data;
      },
      err => console.log(err)
    );
  }

  onChangeKeyword = function(e) {
    // let val = e.target.value;
    // console.log("Input val: " + val);
    // console.log("search: " + this.search);
    // this.getSearchData();
    // if (search != undefined) {
    //rchResult = [];
    //  }
  };

  getSearchData(pageNo, infiniteScroll) {
    this.isLookup = false;
    this.categoryId = "";
    this.governorateId = "";
    this.cityId = "";
    if (this.search != undefined) {
      if (this.search == null || this.search == "") {
        // this.alert.show("Please enter something ");
        this.shared.showToast(
          "Please enter something!",
          3000,
          "bottom",
          "error",
          () => {
            //console.log('Dismissed toast');
          }
        );
        return 0;
      }
    } else {
      // this.alert.show("Please enter something ");
      this.shared.showToast(
        "Please enter something!",
        3000,
        "bottom",
        "error",
        () => {
          //console.log('Dismissed toast');
        }
      );
      return 0;
    }
    let formData: FormData = new FormData();
    formData.append("search", this.search);
    formData.append("currentpage", pageNo + "");
    formData.append("limit", this.limitPerPage + "");

    this.loading.show();
    this.http
      .post(this.config.url + this.config.getSearchData, formData, {
        headers: this.headers
      })
      .map(res => res.json())
      .subscribe(
        data => {
          this.loading.hide();
          if (data.Status == true) {
            this.totalPages = +Math.ceil(data.Records / data.LimitPerPage);
            // this.shared.showToast(this.totalPages + '', 3000, 'bottom', 'error', () => { });
            console.log("Total Pages >>>> " + this.totalPages);
            if (this.totalPages > 1) {
            } else this.searchResult = [];
            for (let i = 0; i < data.Result.length; i++) {
              this.searchResult.push(data.Result[i]);
            }

            if (infiniteScroll != null && infiniteScroll != undefined)
              infiniteScroll.complete();
          }
          if (data.Status == false) {
            // this.alert.show(data.message);
            this.shared.showToast(data.Message, 3000, "bottom", "error", () => {
              // console.log('Dismissed toast');
            });
            if (
              this.searchResult == null ||
              this.searchResult == undefined ||
              this.searchResult.length == 0
            )
              this.searchResult = [];
            if (infiniteScroll != null && infiniteScroll != undefined)
              infiniteScroll.complete();
          }
        },
        error => {
          this.loading.hide();
          var errMsg = "Error while Loading data! ";
          if (error.status == 403) {
            errMsg += "\n" + JSON.parse(error._body).error;
          }
          // this.alert.show(errMsg);
          this.shared.showToast(errMsg, 3000, "bottom", "error", () => {
            //console.log('Dismissed toast');
          });
          if (
            this.searchResult == null ||
            this.searchResult == undefined ||
            this.searchResult.length == 0
          )
            this.searchResult = [];
          if (infiniteScroll != null && infiniteScroll != undefined)
            infiniteScroll.complete();
        }
      );
  }

  doInfinite(infiniteScroll) {
    this.pageNo = this.pageNo + 1;
    setTimeout(() => {
      if (this.isLookup) {
        this.getLookupData(this.pageNo, infiniteScroll);
      } else {
        this.getSearchData(this.pageNo, infiniteScroll);
      }
    }, 1000);
  }

  getLookupData(pageNo, infiniteScroll) {
    this.isLookup = true;
    if (!this.categoryId || !this.cityId) {
      // this.shared.showToast('Please select category and city!', 1000, 'bottom', 'error', () => {
      // });
      return 0;
    }

    this.search = "";

    let formData: FormData = new FormData();
    formData.append("categoryid", this.categoryId);
    formData.append("cityid", this.cityId);
    formData.append("currentpage", pageNo + "");
    formData.append("limit", this.limitPerPage + "");

    this.loading.show();
    this.http
      .post(this.config.url + this.config.getLookupData, formData, {
        headers: this.headers
      })
      .map(res => res.json())
      .subscribe(
        data => {
          this.loading.hide();
          this.totalPages = Math.ceil(data.Records / data.LimitPerPage);
          if (data.Status == true) {
            if (this.totalPages > 1) {
            } else this.searchResult = [];
            for (let i = 0; i < data.Result.length; i++) {
              this.searchResult.push(data.Result[i]);
            }
          }

          if (data.Status == false) {
            this.shared.showToast(data.Message, 1000, "bottom", "error", () => {
              if (
                this.searchResult == null ||
                this.searchResult == undefined ||
                this.searchResult.length == 0
              )
                this.searchResult = [];
            });
          }
          infiniteScroll.complete();
        },
        error => {
          this.loading.hide();
          var errMsg = "Error while Loading data! ";
          if (error.status == 403) {
            errMsg += "\n" + JSON.parse(error._body).error;
          } else if (error.status == 400) {
            let errors = JSON.parse(error._body).Message;
            for (let key in errors) {
              errMsg += "\n" + (key + " : " + errors[key] + "!");
            }
          }
          this.shared.showToast(errMsg, 3000, "bottom", "error", () => {
            if (
              this.searchResult == null ||
              this.searchResult == undefined ||
              this.searchResult.length == 0
            )
              this.searchResult = [];
          });
          if (infiniteScroll != null && infiniteScroll != undefined)
            infiniteScroll.complete();
        }
      );
  }

  openProducts(subCategory) {
    this.navCtrl.push(ProductsPage, { subCategory: subCategory });
  }

  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }
}
