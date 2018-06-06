import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyRatingPage } from './company-rating';
import { Ionic2RatingModule } from 'ionic2-rating';


@NgModule({
    imports: [
      TranslateModule,
        IonicPageModule.forChild(CompanyRatingPage),
        Ionic2RatingModule,
        
    ],
    exports: [CompanyRatingPage],
    declarations: [CompanyRatingPage],
    providers: [],
})
export class CompanyRatingModule { }