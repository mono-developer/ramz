import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PublishPage } from './publish';
import { FileTransfer } from '@ionic-native/file-transfer';




@NgModule({
    imports: [
        TranslateModule,
        IonicPageModule.forChild(PublishPage)
    ],
    exports: [PublishPage],
    declarations: [PublishPage],
    providers: [FileTransfer],
})
export class AddProductModule { }