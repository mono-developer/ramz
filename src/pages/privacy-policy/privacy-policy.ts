import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { ConfigProvider } from '../../providers/config/config';


@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {
  langId: number;
  constructor(
    public viewCtrl: ViewController,
    public config: ConfigProvider,
    public sharedData: SharedDataProvider,
    translate: TranslateService) {
    this.langId = +this.config.langId;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
