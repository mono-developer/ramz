// Project Name: Ramz
// Project URI: http://Ramz.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, IonicPage, NavParams, ToastController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { LoadDataProvider } from '../../providers/load-data/load-data';
import { Http, Headers } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';
import { HttpClient } from '@angular/common/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { Status } from '../../models/status';
import { CompanyInfo } from '../../models/Product';
import { Camera } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';

import { normalizeURL } from 'ionic-angular';
import { FileUploadOptions, FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
@IonicPage({
  priority: 'high',
})
@Component({
  selector: 'add-publish',
  templateUrl: 'publish.html',
})
export class PublishPage {

  data = {

    companyid: '',
    categoryid: '',
    image: '',
    agefrom: '',
    ageto: '',
    gender: 'a',
    cityid: '',
    governorateId: ''

  };
  private transfer: FileTransferObject = this.fileTransfer.create();
  governorates: any;
  cities: any;
  selectedCategories: any[] = [];
  allCategories: any[] = this.shared.categories;
  profilePicture = 'assets/img/file-upload.svg';
  public tempPhoto: any = null;
  constructor(
    public viewCtrl: ViewController,
    private loadDataProvider: LoadDataProvider,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public http: HttpClient,
    public navParams: NavParams,
    private fileTransfer: FileTransfer,
    private readonly file: File,
    private camera: Camera,
    public toastCtrl: ToastController,
    translate: TranslateService) {
    loadDataProvider.getGovernorates().then(data => {
      this.governorates = data;
    }, err => console.log(err));
  }
  getCities(goverId) {
    this.loadDataProvider.getCities(goverId).then(data => {
      this.cities = data;
    }, err => console.log(err));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      allowEdit: true,
      targetWidth: 500,
      targetHeight: 700,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
      this.profilePicture = normalizeURL(imageData);
      this.tempPhoto = imageData;
      // this.uploadPhoto(imageData);
    }, error => {
      // this.error = JSON.stringify(error);
      console.log("Error at SelectPhoto to get Picture: " + error)
    });
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], { type: file.type });
      formData.append('companyid', this.shared.customerData.customers_id);
      formData.append('categoryid', this.data.categoryid);
      formData.append('image', imgBlob, file.name);
      formData.append('agefrom', this.data.agefrom);
      formData.append('ageto', this.data.ageto);
      formData.append('gender', this.data.gender);
      formData.append('cityid', this.data.cityid);
      this.save(formData);
    };
    reader.readAsArrayBuffer(file);
  }
  save(formData: FormData) {
    this.http.post<Status>(this.config.url + this.config.advertisement, formData).subscribe(data => {


      if (data.Status) {
        this.loading.hide();
        this.shared.showToast('Successfully add your advertisement', 3000, 'bottom', 'success', () => {
          this.dismiss();
        });
      }
    }
      , error => {
        this.loading.hide();
        var errMsg = '';
        errMsg = "add your advertisement failed. \n";
        console.log("error: " + error)
        this.shared.showToast(errMsg, 3000, 'bottom', 'success', () => {
          // this.dismiss();
        });
        // if (error.status == 400) {

        // } else
        //   errMsg = 'Error while Updating!';

        // this.errorMessage = errMsg
        // this.alert.show(errMsg);
      });
  }
  uploadPhoto(imageFileUri: any) {

    this.upload(imageFileUri);
  }
  private upload(file: any) {
    this.loading.show();
    let options: FileUploadOptions = {
      params: {
        companyid: this.shared.customerData.customers_id,
        categoryid: this.data.categoryid,
        agefrom: this.data.agefrom,
        ageto: this.data.ageto,
        gender: this.data.gender,
        cityid: this.data.cityid

      },
      headers: { 'X-API-KEY': this.config.apiKeyValue },
      chunkedMode: false,
      fileKey: 'image',
      mimeType: "multipart/form-data"
    }

    this.transfer.upload(file, this.config.url + this.config.advertisement, options)
      .then(data => {

        this.loading.hide();
        let res = JSON.parse(data.response);
        if (res.Status == true) {
          this.loading.hide();
          this.shared.showToast('Successfully add your advertisement', 3000, 'bottom', 'success', () => {
            this.dismiss();
          });
        }
      }, (error) => {
        this.loading.hide();
        var errMsg = '';
        errMsg = "add your advertisement failed. \n";
        console.log("error: " + error)
        this.shared.showToast(errMsg, 3000, 'bottom', 'success', () => {
          // this.dismiss();
        });
      });
  }




}








