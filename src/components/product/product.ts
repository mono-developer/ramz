
import { Component, Input } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { LoginPage } from '../../pages/login/login';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'product',
  templateUrl: 'product.html'
})
export class ProductComponent {

  @Input('data') p;//product data
  @Input('type') type;
  @Input('company') company;
  // @Output() someEvent = new EventEmitter();
  constructor(
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events, public storage: Storage
  ) {
    // events.subscribe('wishListUpdate', (id, value) => {
    //   if (this.p.products_id == id) this.p.isLiked = value
    // });

  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.p.products_price);
    var p2 = parseInt(this.p.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }

  showProductDetail() {
    this.navCtrl.push(ProductDetailPage, { data: this.p, company: this.company });

  }

  checkProductNew() {
    var pDate = new Date(this.p.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }


  isInCart() {
    var found = false;
    for (let value of this.shared.cartProducts) {
      if (value.products_id == this.p.products_id) { found = true; }
    }

    if (found == true) return true;
    else return false;
  }

  ngOnChanges() {

  }

  ngOnInit() {

  }

  fav(product) {
    this.isFav(product);
  }

  isFav(product) {
    this.storage.get(`product ${product.BusinessProfileId}`).then((value) => {
      console.log('Your json is valuevalue>>>>> ', value);
      if (value != null) {
        this.storage.remove(`product ${product.BusinessProfileId}`);
        product.favorite = false;
      } else {
        this.storage.set(`product ${product.BusinessProfileId}`, product);
        // to get a key/value pair
        this.storage.get(`product ${product.BusinessProfileId}`).then((val) => {

        });
        product.favorite = true;
      }
    }).catch(() => product.favorite = false);
  }

}
