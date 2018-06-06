import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PkgDetailsPage } from './pkg-details';

@NgModule({
    imports: [
      TranslateModule,
        IonicPageModule.forChild(PkgDetailsPage)
    ],
    exports: [PkgDetailsPage],
    declarations: [PkgDetailsPage],
    providers: [],
})
export class PkgDetailsModule { }