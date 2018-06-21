import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, Content, IonicPage, Events, NavParams, ItemSliding } from 'ionic-angular';
import { SubCategories6Page } from '../sub-categories6/sub-categories6';
import { SearchPage } from '../search/search';
import { LoadingProvider } from '../../providers/loading/loading';
import { HttpClient } from '@angular/common/http';
import { PkgDetails, PkgInfo } from '../../models/PkgDetails';
import { Packages, Pkg } from '../../models/packages';
import { PaymentPage } from '../payment/payment';
import { Comments } from '../../models/comments';
@IonicPage({
  priority: 'high',
  // segment: `packages-page`
})
@Component({
  selector: 'page-pkg-details',
  templateUrl: 'pkg-details.html',
})

export class PkgDetailsPage {
  @ViewChild(Content) content: Content;
  details: PkgInfo;
  segments: any = 'topSeller';
  parent: Pkg;
  termsAgree: false;
  constructor(
    public http: HttpClient,

    public shared: SharedDataProvider,
    public navCtrl: NavController,
    private events: Events,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public navParams: NavParams,
    translate: TranslateService) {
    this.parent = this.navParams.get('pkg');
    this.getPackageDetails();
  }
  openSubCategories(categoryModel) {
    this.navCtrl.push(SubCategories6Page, { 'category': categoryModel });
  }

  ngAfterViewChecked() {
    this.content.resize();
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  changeBackground(id: string) {
    if (id == '1') {
      return 'package1'
    } else if (id == '2') {
      return 'package2'
    } else if (id == '3') {
      return 'package3'
    } else if (id == '4') {
      return 'package4'
    } else if (id == '5') {
      return 'package5'
    }

  }

  getPackageDetails() {
    this.loading.show();
    this.http.get<PkgDetails>(this.config.url + 'package/subscribe/' + this.parent.PackageId + '/' + this.shared.customerData.customers_id).subscribe(data => {
      this.details = data.Result;
      console.log(this.details);
      this.loading.hide();
    });
  }

  pay(slidingItem: ItemSliding) {
    this.navCtrl.push(PaymentPage, { 'pkg': this.parent, 'pkgDetails': this.details });
    //
  }
  goToFree() {
    this.loading.show();
    let formData: FormData = new FormData();
    formData.append('companyid', this.shared.customerData.customers_id);
    formData.append('packageid', this.details.PackageId);
    formData.append('expirationdate', this.details.DueDate);
    this.http.post<Comments>(this.config.url + 'package/free', formData).subscribe(data => {
      if (data.Status) {
        this.shared.customerData.isActive = "1";
        this.shared.isActive = true;
        this.events.publish('user:changed', Date.now());
      } else {
        this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
        });
      }
      this.loading.hide();
    });
  }


}
