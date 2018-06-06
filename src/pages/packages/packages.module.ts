import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PackagesPage } from './packages';

@NgModule({
    imports: [
      TranslateModule,
        IonicPageModule.forChild(PackagesPage)
    ],
    exports: [PackagesPage],
    declarations: [PackagesPage],
    providers: [],
})
export class PackagesPageModule { }