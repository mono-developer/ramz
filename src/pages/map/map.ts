import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, LoadingController, ToastController, Platform, Events, App, NavParams } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AlertProvider } from '../../providers/alert/alert';
import { GooglePlus } from '@ionic-native/google-plus';
import { IntroPage } from '../intro/intro';
import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';
import { Location } from '../../models/location'
import { PlacesService } from '../../providers/services/places';
import { SetLocationPage } from '../set-location/set-location';
import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Place } from '../../models/place';
import { PackagesPage } from '../packages/packages';
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',

})
export class MapPage {
  formData = { customers_email_address: '', customers_password: '' };
  errorMessage = '';
  companyInfo;

  places: Place;
  height: string = "85%";
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  constructor(
    public storage: Storage,
    public http: Http,
    public navCtrl: NavController,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private fb: Facebook,
    public alert: AlertProvider,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private placesService: PlacesService,
    private plt: Platform,
    private events: Events,
    public app: App,
    public navParams: NavParams
  ) {

    this.companyInfo = this.navParams.get('companyInfo')
    // console.log('SharePage companyInfo' + JSON.stringify(this.companyInfo));
    if (this.companyInfo) {
      this.height = "100%"
    } else {
      this.height = "85%";
    }

    if (this.companyInfo && this.companyInfo.Latitude != null && this.companyInfo.Latitude != ""
      && this.companyInfo.Longitude != null && this.companyInfo.Longitude != "") {
      this.location = {
        lat: +this.companyInfo.Latitude,
        lng: +this.companyInfo.Longitude,
      };
      this.placesService
        .addPlace('company', 'location', this.location);
      this.locationIsSet = true;
    } else
      if (this.shared.customerData.Latitude != null && this.shared.customerData.Latitude != ""
        && this.shared.customerData.Longitude != null && this.shared.customerData.Longitude != "") {
        this.location = {
          lat: +this.shared.customerData.Latitude,
          lng: +this.shared.customerData.Longitude,
        };
        this.placesService
          .addPlace('company', 'location', this.location);
        this.locationIsSet = true;
      } else {
        this.onLocate();
      }

    this.placesService.fetchPlaces()
      .then(
        (places: Place) => {
          this.places = places;
          if (this.places != null && this.places != undefined && this.places.location != undefined && this.places.location != null)
            this.location = {
              lat: +this.places.location.lat,
              lng: +this.places.location.lng
            };
          this.locationIsSet = true;
        }
      );
  }
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }
  location: Location = {
    lat: 23.614328,
    lng: 58.545284
  };
  locationIsSet = false;



  onSubmit(form: NgForm) {
    this.submit();
  }

  saveLocationIntoLocalStorage() {
    this.placesService
      .addPlace('company', 'location', this.location);
    this.placesService.fetchPlaces()
      .then(
        (places: Place) => {
          this.places = places;
          if (this.places != null && this.places != undefined && this.places.location != undefined && this.places.location != null)
            this.location = {
              lat: +this.places.location.lat,
              lng: +this.places.location.lng
            };
        }
      );
    this.locationIsSet = true;
  }
  submit() {
    this.loading.show();
    let formData: FormData = new FormData();
    formData.append('latitude', this.location.lat + '');
    formData.append('longitude', this.location.lng + '');
    formData.append('companyid', this.shared.customerData.customers_id);
    console.log('Company ID >>>>> ' + this.shared.customerData.customers_id);
    this.http.post(this.config.url + this.config.setLocation, formData, { headers: this.headers })
      .map(res => res.json()).subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          this.saveLocationIntoLocalStorage();
          this.shared.customerData.Latitude = this.location.lat;
          this.shared.customerData.Longitude = this.location.lng;
          this.shared.showToast(data.Message, 3000, 'bottom', 'success', () => {
            if (!this.shared.isActive) {
              this.app.getRootNavs()[0].setRoot(PackagesPage);
            } else {
              this.events.publish('user:changed', Date.now());
            }
          });
        } else {
          this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
          });
        }
      }, function (response) {
        this.loading.hide();
        // this.alert.show("Error server not reponding");
        this.shared.showToast('Saving failed', 3000, 'bottom', 'error', () => {
          //console.log('Dismissed toast');
        });
      });


  };

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage,
      { location: this.location, isSet: this.locationIsSet });
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (this.plt.is('ios')) {
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
          this.location = {
            lat: +resp.coords.latitude,
            lng: +resp.coords.longitude,
          };
        })
      }


      else {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(
          () => {
            const loader = this.loadingCtrl.create({
              content: 'Getting your Location...'
            });
            loader.present();
            this.geolocation.getCurrentPosition()
              .then(
                location => {
                  loader.dismiss();

                  this.location.lat = +location.coords.latitude;
                  this.location.lng = +location.coords.longitude;
                  this.locationIsSet = true;
                }
              )
              .catch(
                error => {
                  loader.dismiss();
                  const toast = this.toastCtrl.create({
                    message: 'Could get location, please pick it manually!',
                    duration: 2500
                  });
                  toast.present();
                }
              );
          },
          error => console.log('Error requesting location permissions', error)
        );
      }

    });

  }

  onTakePhoto() {
    // Camera.getPicture({
    //   encodingType: Camera.EncodingType.JPEG,
    //   correctOrientation: true
    // })
    //   .then(
    //     imageData => {
    //       const currentName = imageData.replace(/^.*[\\\/]/, '');
    //       const path = imageData.replace(/[^\/]*$/, '');
    //       const newFileName = new Date().getUTCMilliseconds() + '.jpg';
    //       File.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
    //         .then(
    //           (data: Entry) => {
    //             this.imageUrl = data.nativeURL;
    //             Camera.cleanup();
    //             // File.removeFile(path, currentName);
    //           }
    //         )
    //         .catch(
    //           (err: FileError) => {
    //             this.imageUrl = '';
    //             const toast = this.toastCtrl.create({
    //               message: 'Could not save the image. Please try again',
    //               duration: 2500
    //             });
    //             toast.present();
    //             Camera.cleanup();
    //           }
    //         );
    //       this.imageUrl = imageData;
    //     }
    //   )
    //   .catch(
    //     err => {
    //       const toast = this.toastCtrl.create({
    //         message: 'Could not take the image. Please try again',
    //         duration: 2500
    //       });
    //       toast.present();
    //     }
    //   );
  }
}


