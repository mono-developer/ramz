import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, App } from 'ionic-angular';
import { MyAccountPage } from '../my-account/my-account';

import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { CompanyAccountPage } from '../company-account/company-account';

/**
 * Generated class for the GreatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-greating',
  templateUrl: 'greating.html',
})
export class GreatingPage {

  customerType = this.shared.customerType;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    private platform: Platform,
    public appCtrl: App
  ) {
    // this.platform.registerBackButtonAction(() => {

    // });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad GreatingPage');
  }

  openPage() {
    if (this.shared.isCompany) {
      // this.appCtrl.getRootNav().push(CompanyAccountPage);
      this.appCtrl.getRootNavs()[0].setRoot(CompanyAccountPage);
    } else {
      // this.appCtrl.getRootNav().push(MyAccountPage);
      this.appCtrl.getRootNavs()[0].setRoot(MyAccountPage);
      // this.navCtrl.push(MyAccountPage).then(() => {
      //   const index = this.viewCtrl.index;
      //   this.navCtrl.remove(index);
      // });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
