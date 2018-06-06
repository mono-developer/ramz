import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddProductPage } from './add-product';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';



@NgModule({
    imports: [
        TranslateModule,
        IonicPageModule.forChild(AddProductPage)
    ],
    exports: [AddProductPage],
    declarations: [AddProductPage],
    providers: [FileTransfer, FileChooser],
})
export class AddProductModule { }