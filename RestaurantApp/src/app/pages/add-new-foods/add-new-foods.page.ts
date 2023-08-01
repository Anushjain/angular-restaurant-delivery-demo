import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import { PreviewPage } from '../preview/preview.page';
@Component({
  selector: 'app-add-new-foods',
  templateUrl: './add-new-foods.page.html',
  styleUrls: ['./add-new-foods.page.scss'],
})
export class AddNewFoodsPage implements OnInit {
  categories: any[] = [];
  name: any;
  cid: any;
  price: any;
  descriptions: any;
  task: AngularFireUploadTask;
  ref: AngularFireStorageReference;
  uploadState: Observable<string>;
  downloadURL: Observable<string>;
  uploadProgress: Observable<number>;
  image: any = '';
  db = firebase.firestore();
  coverImage: any;
  isEdit: boolean = false;
  ratting: any;
  id: any;
  veg: boolean = true;
  status: boolean;
  // variation: boolean = false;
  // smallPrice: any;
  // mediumPrice: any;
  // largePrice: any;
  variations: any[] = [];
  size: boolean = false;
  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private util: UtilService,
    private api: ApisService,
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) {
    // this.variation = false;
  }


  ionViewWillEnter() {
    this.category();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.isEdit = true;
        this.api.getFoodWithId(localStorage.getItem('uid'), data.id).then((info) => {
          console.log(info);
          if (info) {
            this.cid = info.cid.id;
            this.name = info.name;
            this.coverImage = info.cover;
            this.price = info.price;
            this.descriptions = info.desc;
            this.ratting = info.ratting;
            this.id = info.id;
            this.veg = info.veg;
            this.status = info.status ? info.status : true;
            console.log('status-------', info.status);
            this.variations = info.variations && info.variations.length ? info.variations : [];
            this.size = info.size;
          }
        }, error => {
          console.log(error);
          this.util.errorToast(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      }
    });
  }

  changeSize(event) {
    console.log(event);
    if (event && event.detail && event.detail.checked) {
      const items = this.variations.filter(x => x.title === 'size');
      console.log('length', items);
      if (!items.length) {
        const item = {
          title: 'size',
          type: 'radio',
          items: []
        };
        this.variations.push(item);
        console.log(this.variations);
      }
    } else {
      this.variations = this.variations.filter(x => x.title !== 'size');
    }
  }

  category() {
    this.api.getVenueCategories(localStorage.getItem('uid')).then((data) => {
      console.log(data);
      if (data) {
        this.categories = data;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  async cover() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('Delete clicked');
          this.opemCamera('camera');
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'image',
        handler: () => {
          console.log('Share clicked');
          this.opemCamera('gallery');
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async addNew() {

    const alert = await this.alertController.create({
      header: 'Add Add-ons!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.name) {
              const item = this.variations.filter(x => x.title === data.name);
              console.log('=>"', item);
              if (item && item.length > 0) {
                this.util.errorToast('Duplicate');
              } else {
                this.presentAlertRadio(data.name);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editTitle(index) {

    const alert = await this.alertController.create({
      header: 'Edit title!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Title',
          value: this.variations[index].title
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.name) {
              this.variations[index].title = data.name;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertRadio(name) {
    const alert = await this.alertController.create({
      header: 'Select Type',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Only One',
          value: 'radio',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Multiple',
          value: 'check'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            const item = {
              title: name,
              type: data,
              items: []
            };
            this.variations.push(item);
            console.log(this.variations);
          }
        }
      ]
    });

    await alert.present();
  }

  opemCamera(type) {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 700,
      targetWidth: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type === 'camera' ? 1 : 0
    };
    console.log('open');
    this.camera.getPicture(options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image = base64Image;
      this.util.show();
      const id = localStorage.getItem('uid') + '/' + this.util.makeid(10);
      firebase.storage().ref().child(localStorage.getItem('uid')).child(btoa(id) + '.jpg')
        .putString(base64Image, 'data_url').then((snapshot) => {
          this.util.hide();
          snapshot.ref.getDownloadURL().then((url) => {
            console.log('url uploaded', url);
            this.coverImage = url;
          });
        }, error => {
          this.util.hide();
          console.log(error);
          this.util.errorToast(this.util.translate('Something went wrong'));
        }).catch((error) => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
    }, (err) => {
      this.util.hide();
    });
  }

  getBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
  }

  submit() {
    if (this.name === '' || !this.name || this.cid === '' ||
      !this.cid || this.price === '' || !this.price || this.descriptions === '' || !this.descriptions) {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.util.errorToast(this.util.translate('Please add your cover image'));
      return false;
    }
    this.util.show();
    if (this.isEdit) {
      console.log(this.cid);
      const status = this.status;
      console.log(Boolean(status));
      const parma = {
        uid: localStorage.getItem('uid'),
        id: this.id,
        cid: this.db.collection('categories').doc(this.cid),
        name: this.name,
        price: this.price,
        desc: this.descriptions,
        cover: this.coverImage,
        veg: this.veg,
        status: this.getBool(this.status),
        variations: this.variations,
        size: this.size

      };

      this.api.updateFood(parma.uid, this.id, parma).then((data) => {
        this.util.hide();
        this.util.showToast(this.util.translate('Food updated Successfully'), 'success', 'bottom');
        this.navCtrl.back();
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    } else {
      console.log(this.cid);
      const id = this.util.makeid(10);
      const param = {
        uid: localStorage.getItem('uid'),
        cid: this.db.collection('categories').doc(this.cid),
        name: this.name,
        price: this.price,
        desc: this.descriptions,
        cover: this.coverImage,
        ratting: 0,
        veg: this.veg,
        status: true,
        variations: this.variations,
        size: this.size,
        id: id
      };

      this.api.addFood(localStorage.getItem('uid'), id, param).then((data) => {
        this.util.hide();
        this.util.showToast(this.util.translate('Food Added Successfully'), 'success', 'bottom');
        const updateParam = {
          uid: localStorage.getItem('uid'),
          isClose: false
        };
        this.api.updateVenue(updateParam).then(data => {
          console.log(data);
        }).catch(error => {
          console.log(error);
        });
        this.navCtrl.back();
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    }

  }

  delete(item) {
    console.log(item);
    if (item.title === 'size') {
      this.size = false;
    }

    this.variations = this.variations.filter(x => x.title !== item.title);
  }

  async addItem(index) {
    console.log(this.variations[index]);
    const alert = await this.alertController.create({
      header: 'Add item to ' + this.variations[index].title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Add-ons name'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Add-ons price'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.title && data.price) {
              const item = {
                title: data.title,
                price: data.price
              };
              this.variations[index].items.push(item);
              console.log(this.variations);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteSub(index, item) {
    console.log(index);
    console.log(item);
    const selected = this.variations[index].items;
    console.log('selected', selected);
    const data = selected.filter(x => x.title !== item.title);
    console.log(data);
    this.variations[index].items = data;
    console.log('done', this.variations);
  }

  async editSub(index, items, subIndex) {
    console.log(index, items, subIndex);
    console.log(this.variations);
    const alert = await this.alertController.create({
      header: 'Edit item ' + this.variations[index].title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Variation name',
          value: this.variations[index].items[subIndex].title
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Variation price',
          value: this.variations[index].items[subIndex].price
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            this.variations[index].items[subIndex].title = data.title;
            this.variations[index].items[subIndex].price = data.price;
            console.log(this.variations);
          }
        }
      ]
    });

    await alert.present();
  }

  async preview() {
    const modal = await this.modalCtrl.create({
      component: PreviewPage,
      cssClass: 'custom_modal2',
      componentProps: {
        name: this.name,
        variations: this.variations,
        desc: this.descriptions
      }
    });
    return await modal.present();

  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
