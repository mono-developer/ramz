
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ProductsPage } from '../products/products';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from "@ionic-native/file";

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  langId: number;
  comments = [];
  commentdata;
  private request;
  private headers = new Headers({ 'X-API-KEY': this.config.apiKeyValue });
  customerType = this.shared.customerType;
  attachedFile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public toastCtrl: ToastController,
    private camera: Camera,
    private readonly file: File
  ) {
    this.langId = localStorage.langId;

    this.request = this.navParams.get('request');
    if (this.request != undefined && this.request)
      this.getComments(this.request.RequestId);
  }

  openInfo(request) {
    // console.log(JSON.stringify(request));
    this.navCtrl.push('RequestOrderPage', { 'request': request });
  }

  getComments(requestId) {
    this.loading.show();
    this.http.get(this.config.url + this.config.getComments + requestId, { headers: this.headers })
      .map(res => res.json())
      .subscribe(data => {
        this.loading.hide();
        if (data.Status == true)
          this.comments = data.Result;
        else if (data.Status == false) {
          this.comments = [];
          this.shared.showToast(data.Message, 3000, 'bottom', 'error', () => {
          });
        }
      }, error => {
        this.loading.hide();
        var errMsg = 'Error while Loading comments! ';
        if (error.status == 403) {
          errMsg += '\n' + JSON.parse(error._body).error;
        }
        else if (error.status == 400) {
          errMsg += '\n' + JSON.parse(error._body).Message;
        }
        this.shared.showToast(errMsg, 3000, 'bottom', 'error', () => {
        });
      });
  }


  selectFile(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 80,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
      this.attachedFile = imageData;
      // this.uploadPhoto(imageData);
    }, error => {
      // this.error = JSON.stringify(error);
      console.log("Error at SelectPhoto to get Picture: " + error)
    });
  }

  private uploadPhoto(imageFileUri: any): void {
    // this.error = null;
    //console.log("imageFileUri: "+imageFileUri)
    this.loading.show();

    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], { type: file.type });
      formData.append('userid', this.shared.customerData.customers_id);
      formData.append('requestid', this.request.RequestId);
      formData.append('companyid', this.request.CompanyId);
      formData.append('comment', this.commentdata);
      formData.append('file', imgBlob, file.name);
      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  private postData(formData: FormData) {
    var subUrl;
    if (this.customerType == 'company')
      subUrl = this.config.setCompanyComment;
    else
      subUrl = this.config.setComment;

    this.http.post(this.config.url + subUrl, formData, { headers: this.headers })
      .map(res => res.json()).subscribe(data => {
        this.loading.hide();
        if (data.Status == true) {
          this.comments.push(data.Result);
          this.attachedFile = null;
          this.commentdata = '';
          this.shared.showToast(data.Message, 3000, 'bottom', 'success', () => {
            //console.log('Dismissed toast');
          });
        }
      }
        , error => {
          this.loading.hide();
          var errMsg = "Sorry, Send comment failed: \n";
          if (error.status == 400) {
            errMsg += JSON.parse(error._body).Message;
            // console.log("errMsg2: " + errMsg)
          }
          // this.alert.show(errMsg);
          this.shared.showToast(errMsg, 3000, 'bottom', 'error', () => {
            //console.log('Dismissed toast');
          });
        });
  }

  sendComment() {
    if (this.attachedFile) {
      this.uploadPhoto(this.attachedFile);
    } else {
      const formData = new FormData();
      formData.append('userid', this.shared.customerData.customers_id);
      formData.append('requestid', this.request.RequestId);
      formData.append('companyid', this.request.CompanyId);
      formData.append('comment', this.commentdata);
      this.postData(formData);
    }
  }


}
