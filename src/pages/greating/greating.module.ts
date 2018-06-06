import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GreatingPage } from './greating';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule,
      IonicPageModule.forChild(GreatingPage)
  ],
  exports: [GreatingPage],
  declarations: [GreatingPage],
  providers: [],
})
export class GreatingPageModule {}
