import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
/*
  Generated class for the LoadDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadDataProvider {

  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  governorates: any = null;
  cities: any = null;
  categories: any = null;
  goverId: number;

  constructor(public http: Http, public config: ConfigProvider) {
    // console.log('Hello LoadDataProvider Provider');
  }

  getGovernorates() {
    if (this.governorates) {
      // already loaded data
      return Promise.resolve(this.governorates);
    }
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(this.config.url + this.config.getAllGovernorates, { headers: this.headers })
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.governorates = data.Result;
          resolve(this.governorates);
        });
    });
  }

  getCities(goverId) {

    if (this.goverId && this.goverId == goverId && this.cities) {
      // already loaded data
      return Promise.resolve(this.cities);
    }
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(this.config.url + this.config.getCities + goverId, { headers: this.headers })
        .map(res => res.json())
        .subscribe(data => {
          this.goverId = goverId;
          this.cities = data.Result;
          resolve(this.cities);
        });
    });
  }

  getCategories() {
    if (this.categories) {
      return Promise.resolve(this.categories);
    }
    return new Promise(resolve => {
      this.http.get(this.config.url + this.config.allcategory, { headers: this.headers })
        .map(res => res.json())
        .subscribe(data => {
          this.categories = data.Result;
          resolve(this.categories);
        });
    });
  }
}