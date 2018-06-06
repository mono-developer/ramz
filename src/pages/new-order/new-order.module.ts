import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NewOrderPage } from './new-order';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DatePicker } from '@ionic-native/date-picker';
@NgModule({
    imports: [
        TranslateModule,
        IonicPageModule.forChild(NewOrderPage),
        AngularSvgIconModule
    ],
    exports: [NewOrderPage],
    declarations: [NewOrderPage],
    providers: [DatePicker],
})
export class NewOrderModule { }