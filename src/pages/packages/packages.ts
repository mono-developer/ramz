// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, Content, IonicPage, Events } from 'ionic-angular';
import { SubCategories6Page } from '../sub-categories6/sub-categories6';
import { SearchPage } from '../search/search';
import { LoadingProvider } from '../../providers/loading/loading';
import { PkgDetailsPage } from '../pkg-details/pkg-details';
@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-packages',
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
  templateUrl: 'packages.html',
})

export class PackagesPage {
  @ViewChild(Content) content: Content;

  segments: any = 'topSeller';
  constructor(
    public http: Http,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    private events: Events,
    public loading: LoadingProvider,
    translate: TranslateService) {

  }
  openDetails(obj) {
    this.navCtrl.push(PkgDetailsPage, { 'pkg': obj });
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
  changeColor(id: string) {
    if (id == '1') {
      return 'packageColor1'
    } else if (id == '2') {
      return 'packageColor2'
    } else if (id == '3') {
      return 'packageColor3'
    } else if (id == '4') {
      return 'packageColor4'
    } else if (id == '5') {
      return 'packageColor5'
    }

  }
}
