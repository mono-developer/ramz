import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentPage } from './payment';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
    imports: [
        BrMaskerModule,
      TranslateModule,
        IonicPageModule.forChild(PaymentPage)
    ],
    exports: [PaymentPage],
    declarations: [PaymentPage],
    providers: [],
})
export class PaymentModule { }