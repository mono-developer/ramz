import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { OfferPricePage } from './offer-price';


@NgModule({
    imports: [
      TranslateModule,
        IonicPageModule.forChild(OfferPricePage)
    ],
    exports: [OfferPricePage],
    declarations: [OfferPricePage],
    providers: [],
})
export class OfferPriceModule { }