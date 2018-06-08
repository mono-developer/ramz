
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ModalController } from 'ionic-angular';
// import { HomePage } from '../home/home';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
// import { Home2Page } from '../home2/home2';
// import { Home3Page } from '../home3/home3';
// import { Home4Page } from '../home4/home4';
import { Home5Page } from '../home5/home5';
import { SignUpPage } from '../sign-up/sign-up';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  @ViewChild(Slides) slider: Slides;
  public url: String = "assets/intro/1.png";
  public slides = [
    { image: "assets/intro/1.png", title: "Home Page", icon: "home", description: "" },
    { image: "assets/intro/2.png", title: "Category Page", icon: "cart", description: "" },
    { image: "assets/intro/3.png", title: "Shop Page", icon: "share", description: "" }
  ];

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public config: ConfigProvider, ) {

  }
  openHomePage() {
    // if (this.config.homePage == 1) { this.navCtrl.setRoot(HomePage); }
    // if (this.config.homePage == 2) { this.navCtrl.setRoot(Home2Page); }
    // if (this.config.homePage == 3) { this.navCtrl.setRoot(Home3Page); }
    // if (this.config.homePage == 4) { this.navCtrl.setRoot(Home4Page); }
    if (this.config.homePage == 5) { this.navCtrl.setRoot(Home5Page); }
  }

  slideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    // console.log('Current index is', currentIndex);
    if (currentIndex == 3)
      this.slider.slideTo(0)
    else
      this.url = "assets/intro/" + (+currentIndex + 1) + ".png";
  }

  changeBackground(): any {
    return { 'background-image': 'url("' + this.url + '")' };
  }

  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
  }

  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();

  }


}
