import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Place } from "../../models/place";
import { Location } from "../../models/location";


declare var cordova: any;

@Injectable()
export class PlacesService {
  private places: Place ;

  constructor(private storage: Storage) {}

  addPlace(title: string,
           description: string,
           location: Location
           ) {
    const place = new Place(title, description, location);
    this.places=place;
    this.storage.set('places', place)
      .then()
      .catch(
        err => {
          this.places=place;
        }
      );
  }


  fetchPlaces() {
    return this.storage.get('places')
      .then(
        (places: Place) => {
          this.places = places != null ? places : null;
          return this.places;
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  // deletePlace(index: number) {
  //   const place = this.places[index];
  //   this.places.splice(index, 1);
  //   this.storage.set('places', this.places)
  //     .then(
  //       () => {
  //         this.removeFile(place);
  //       }
  //     )
  //     .catch(
  //       err => console.log(err)
  //     );
  // }


}
