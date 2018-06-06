import { Component, ViewChild, ElementRef, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";

import { Location } from "../../models/location";
import { FormControl } from '@angular/forms';
import { MapsAPILoader, AgmMap, LatLngBounds } from '@agm/core';
import { PlacesService } from '../../providers/services/places';
// import { google } from '@agm/core/services/google-maps-types';
declare let google: any;
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html'
})
export class SetLocationPage implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    console.log(this.agmMap);
    var input = document.getElementById('searchInput');

    this.agmMap.mapReady.subscribe(map => {
      const bounds: LatLngBounds = new google.maps.LatLngBounds();

      bounds.extend(new google.maps.LatLng(this.location.lat, this.location.lng));
      this.zoom = 13;
      map.fitBounds(bounds);
      map.panToBounds(bounds);

    });
  }
  @ViewChild('AgmMap') agmMap: AgmMap;
  location: Location;
  marker: Location;
  zoom: number;
  public searchControl: FormControl;


  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(private navParams: NavParams,
    private viewCtrl: ViewController, private mapsAPILoader: MapsAPILoader,
    private placesService: PlacesService,
    private ngZone: NgZone) {
    this.location = this.navParams.get('location');
    if (this.navParams.get('isSet')) {
      this.marker = this.location;
    }
    this.marker = this.location;


    // this.zoom = 1;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    if (this.location == null || this.location.lat == null || this.location.lng == null)
      this.setCurrentPosition();
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(+this.location.lat, +this.location.lng));
    var center = new google.maps.LatLng(+this.location.lat, +this.location.lng);
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["establishment"], bounds: defaultBounds, center: center, zoom: 13
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place resul
          // let  place= new google.maps.places.PlaceResult;
          // let   place=  autocomplete.getPlace();

          //verify result
          if (autocomplete.getPlace().geometry === undefined || autocomplete.getPlace().geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.location.lat = autocomplete.getPlace().geometry.location.lat();
          this.location.lng = autocomplete.getPlace().geometry.location.lng();
          this.zoom = 13;

          this.marker = this.location;


        });
      });
    });
  }

  onSetMarker(event: any) {
    console.log(event);
    this.zoom = 13;

    this.marker = new Location(event.coords.lat, event.coords.lng);
    this.location = this.marker;


  }

  onConfirm() {
    this.saveLocationIntoLocalStorage();
    this.viewCtrl.dismiss({ location: this.marker });
  }

  saveLocationIntoLocalStorage() {
    this.placesService
      .addPlace('company', 'location', this.location);

  }
  onAbort() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {

  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        this.marker = new Location(this.location.lat, this.location.lng);
        this.zoom = 13;
      });
    }
  }
}
