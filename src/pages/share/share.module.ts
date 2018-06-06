import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharePage } from './share';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { LoadingProvider } from '../../providers/loading/loading';

@NgModule({
  imports: [
    TranslateModule,
      IonicPageModule.forChild(SharePage),
      AngularSvgIconModule,
    
  
  ],
  exports: [SharePage],
  declarations: [SharePage],
  providers: [    AppVersion,  SocialSharing,
    InAppBrowser,   ConfigProvider,  LoadingProvider,
    SharedDataProvider,],
})
export class SharePageModule {}
