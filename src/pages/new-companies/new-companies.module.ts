import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NewCompaniesPage } from './new-companies';



@NgModule({
    imports: [
      TranslateModule,
        IonicPageModule.forChild(NewCompaniesPage)
    ],
    exports: [NewCompaniesPage],
    declarations: [NewCompaniesPage],
    providers: [],
})
export class NewCompaniesModule { }