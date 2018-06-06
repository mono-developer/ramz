// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ProductsPage } from '../products/products';
import { ConfigProvider } from '../../providers/config/config';
import { trigger, style, animate, transition } from '@angular/animations';

import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { Top10Page } from '../top10/top10';
import { Home5Page } from '../home5/home5';


@Component({
  selector: 'page-sub-categories6',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'sub-categories6.html',
})
export class SubCategories6Page {

  parent;
  subcategories = new Array();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    private http: HttpClient, private nav: Nav) {
    this.loading.show();
    this.parent = navParams.get("category");
    // for (let value of this.shared.subCategories) {  
    //   if (value.parent_id == this.parent) {this.subcategories.push(value);}
    // }
    this.http.get<CompanRespone>(config.url + 'category/business/' + this.parent.CategoryId).subscribe(data => {
      this.subcategories = data.Result
      console.log(data);
      this.loading.hide();
    });
  }


  openProducts(subCategory) {
    this.navCtrl.push(ProductsPage, { 'subCategory': subCategory });
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  ionViewDidLoad() {
    // this.loadScript('src/assets/js/custom.js'); 
  }
  openPublish() {
    this.navCtrl.push('PublishPage', { 'companyInfo': null });
  }

  openRequestPage() {
    this.navCtrl.push('NewOrderPage', { 'companyInfo': null });
  }
  openTop() {
    this.navCtrl.push(Top10Page);
  }
  openHome() {
    this.navCtrl.setRoot(Home5Page);
  }

  public loadScript(url) {
    // console.log('preparing to load...')
    // let node = document.createElement('script');
    // node.src = url;
    // node.type = 'text/javascript';
    // document.getElementsByTagName('head')[0].appendChild(node);
  }
}
