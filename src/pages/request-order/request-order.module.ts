import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RequestOrderPage } from './request-order';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DatePicker } from '@ionic-native/date-picker';
@NgModule({
    imports: [
        TranslateModule,
        IonicPageModule.forChild(RequestOrderPage),
        AngularSvgIconModule
    ],
    exports: [RequestOrderPage],
    declarations: [RequestOrderPage],
    providers: [DatePicker],
})
export class RequestOrderModule { }