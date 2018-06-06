import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the RamzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-ramz',
  templateUrl: 'ramz.html',
})
export class RamzPage {
  langId: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public config: ConfigProvider) {
    this.langId = +config.langId;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RamzPage');
  }


  // dismiss() {
  //   this.viewCtrl.dismiss();
  // }

}
