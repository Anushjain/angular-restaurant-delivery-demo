import { VariationsPage } from './../variations/variations.page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, AlertController, PopoverController, ModalController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  @ViewChild('content', { static: false }) private content: any;
  id: any;
  name: any;
  descritions: any;
  cover: any = '';
  address: any;
  ratting: any;
  time: any;
  totalRatting: any;
  dishPrice: any;
  cusine: any[] = [];
  foods: any[] = [];
  dummyFoods: any[] = [];
  categories: any[] = [];
  dummy = Array(50);
  veg: boolean = true;
  totalItem: any = 0;
  totalPrice: any = 0;
  deliveryAddress: any = '';
  foodIds: any[] = [];
  cart: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private popoverController: PopoverController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getVenueDetails();
      }
    });
  }

  getAddress() {
    const address = JSON.parse(localStorage.getItem('deliveryAddress'));
    if (address && address.address) {
      this.deliveryAddress = address.address;
    }
    return this.deliveryAddress;
  }

  getVenueDetails() {

    // Venue Details
    this.api.getVenueDetails(this.id).then(data => {
      console.log(data);
      if (data) {
        this.name = data.name;
        this.descritions = data.descritions;
        this.cover = data.cover;
        this.address = data.address;
        this.ratting = data.ratting ? data.ratting : 0;
        this.totalRatting = data.totalRatting ? data.totalRatting : 2;
        this.dishPrice = data.dishPrice;
        this.time = data.time;
        this.cusine = data.cusine;

        const vid = localStorage.getItem('vid');
        console.log('id', vid, this.id);
        if (vid && vid !== this.id) {
          this.dummy = [];
          this.presentAlertConfirm();
          return false;
        }
        this.getCates();
        this.getFoods();
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getCates() {
    this.api.getVenueCategories(this.id).then(cate => {
      console.log(cate);

      if (cate) {
        this.categories = cate;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getFoods() {
    this.api.getFoods(this.id).then(foods => {
      console.log(foods);
      if (foods) {
        // if()
        this.dummy = [];
        this.foods = [];
        this.dummyFoods = [];
        foods.forEach(element => {
          if (element && element.status === true) {
            const info = {
              cid: {
                id: element.cid.id,
              },
              cover: element.cover,
              desc: element.desc,
              id: element.id,
              name: element.name,
              price: element.price,
              ratting: element.ratting,
              uid: element.uid,
              veg: element.veg,
              quantiy: 0,
              size: element.size,
              variations: element.variations,
              totalRatting: element.totalRatting ? element.totalRatting : 0,
              selectedItem: []
            };
            this.foods.push(info);
            this.dummyFoods.push(info);
            this.foodIds.push(element.id);
          }
        });
        console.log('myfoods', this.foods);
        if (!this.foods.length || this.foods.length === 0) {
          this.util.errorToast(this.util.translate('No Foods found'));
          this.navCtrl.back();
          return false;
        }
        this.changeStatus();
        this.checkCart();
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  checkCart() {
    const userCart = localStorage.getItem('userCart');
    if (userCart && userCart !== 'null' && userCart !== undefined && userCart !== 'undefined') {
      const cart = JSON.parse(userCart);
      console.log('carrt', cart);
      console.log(this.foodIds);
      cart.forEach(element => {
        if (this.foodIds.includes(element.id)) {
          const index = this.foods.findIndex(x => x.id === element.id);
          console.log('index---<', index);
          this.foods[index].quantiy = element.quantiy;
          this.foods[index].selectedItem = element.selectedItem;
        }
      });
      this.calculate();
    }
  }
  back() {
    this.navCtrl.navigateRoot(['tabs']);
  }

  getCusine(cusine) {
    return cusine.join('-');
  }
  add(index) {
    this.api.checkAuth().then((user) => {
      if (user) {
        const vid = localStorage.getItem('vid');
        if (vid && vid !== this.id) {
          this.presentAlertConfirm();
          return false;
        }
        if (this.foods[index].variations && this.foods[index].variations.length) {
          console.log('open modal');
          this.openVariations(index);
        } else {
          this.foods[index].quantiy = 1;
          this.calculate();
        }
      } else {
        this.router.navigate(['login']);
      }
    }).catch(error => {
      console.log(error);
    });


  }

  statusChange() {
    console.log('status', this.veg);
    this.changeStatus();
  }
  calculate() {
    // this.dummy = [];
    // console.log('khaliiii', this.dummy);
    // console.log(this.foods);
    // let item = this.foods.filter(x => x.quantiy > 0);
    // console.log(item);
    // this.totalPrice = 0;
    // this.totalItem = 0;
    // item.forEach(element => {
    //   this.totalItem = this.totalItem + element.quantiy;
    //   this.totalPrice = this.totalPrice + (parseFloat(element.price) * parseInt(element.quantiy));
    // });
    // this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    // console.log('total item', this.totalItem);
    // if (this.totalItem === 0) {
    //   this.totalItem = 0;
    //   this.totalPrice = 0;
    // }
    this.dummy = [];
    console.log('khaliiii', this.dummy);
    console.log(this.foods);
    let item = this.foods.filter(x => x.quantiy > 0);
    this.foods.forEach(element => {
      if (element.quantiy === 0) {
        element.selectedItem = [];
      }
    });
    console.log('item=====>>', item);
    this.totalPrice = 0;
    this.totalItem = 0;
    this.cart = [];
    console.log('cart emplth', this.cart, item);
    item.forEach(element => {
      this.totalItem = this.totalItem + element.quantiy;
      console.log('itemsss----->>>', element);
      if (element && element.selectedItem && element.selectedItem.length > 0) {
        let subPrice = 0;
        element.selectedItem.forEach(subItems => {
          subItems.item.forEach(realsItems => {
            subPrice = subPrice + (realsItems.value);
          });
          subPrice = subPrice * subItems.total;
        });
        this.totalPrice = this.totalPrice + subPrice;
        // this.totalPrice = this.totalPrice + (subPrice * parseInt(element.quantiy));
      } else {
        this.totalPrice = this.totalPrice + (parseFloat(element.price) * parseInt(element.quantiy));
      }
      this.cart.push(element);
    });
    localStorage.removeItem('userCart');
    console.log('carrrrrrr---->>>', this.cart);
    localStorage.setItem('userCart', JSON.stringify(this.cart));
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    console.log('total item', this.totalItem);
    if (this.totalItem === 0) {
      this.totalItem = 0;
      this.totalPrice = 0;
    }
  }

  async setData() {
    const vid = localStorage.getItem('vid');
    console.log('leaving the planet', vid, this.id);
    console.log('total item', this.totalItem);

    if (vid && vid === this.id && this.totalPrice > 0) {
      localStorage.setItem('vid', this.id);
      await localStorage.setItem('foods', JSON.stringify(this.foods));
      localStorage.setItem('categories', JSON.stringify(this.categories));
      localStorage.setItem('dummyItem', JSON.stringify(this.dummyFoods));
      localStorage.setItem('totalItem', this.totalItem);
      localStorage.setItem('totalPrice', this.totalPrice);
    } else if (!vid && this.totalItem > 0) {
      localStorage.setItem('vid', this.id);
      await localStorage.setItem('foods', JSON.stringify(this.foods));
      localStorage.setItem('categories', JSON.stringify(this.categories));
      localStorage.setItem('dummyItem', JSON.stringify(this.dummyFoods));
      localStorage.setItem('totalItem', this.totalItem);
      localStorage.setItem('totalPrice', this.totalPrice);
    } else if (this.totalItem == 0) {
      this.totalItem = 0;
      this.totalPrice = 0;
    }
  }
  async ionViewWillLeave() {
    await this.setData();
  }
  changeStatus() {
    this.foods = this.dummyFoods.filter(x => x.veg === this.veg);
  }
  // addQ(index) {
  //   this.foods[index].quantiy = this.foods[index].quantiy + 1;
  //   this.calculate();
  // }
  // removeQ(index) {
  //   if (this.foods[index].quantiy !== 0) {
  //     this.foods[index].quantiy = this.foods[index].quantiy - 1;
  //   } else {
  //     this.foods[index].quantiy = 0;
  //   }
  //   this.calculate();
  // }


  async openVariations(index) {
    const modal = await this.modalCtrl.create({
      component: VariationsPage,
      cssClass: 'custom_modal2',
      componentProps: {
        name: this.name,
        food: this.foods[index]
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log('from variations', data.data);
      console.log('data.data', data.role);
      let isValid = false;
      if (data.role === 'new') {
        this.foods[index].quantiy = 1;
        const carts = {
          item: data.data,
          total: 1
        };
        this.foods[index].selectedItem.push(carts);
        isValid = true;
      } else if (data.role === 'sameChoice') {
        this.foods[index].selectedItem = data.data;
        this.foods[index].quantiy = this.foods[index].selectedItem.length;
        isValid = true;
      } else if (data.role === 'newCustom') {
        const carts = {
          item: data.data,
          total: 1
        };
        this.foods[index].selectedItem.push(carts);
        this.foods[index].quantiy = this.foods[index].quantiy + 1;
        isValid = true;
      } else if (data.role === 'remove') {
        console.log('number', data.data);
        this.foods[index].quantiy = 0;
        this.foods[index].selectedItem = [];
        isValid = true;
      } else {
        console.log('empy');
      }
      if (isValid) {
        console.log('isValid', isValid);
        this.calculate();
      }
    });
    return await modal.present();
  }
  addQ(index) {
    console.log('foooduieeeee===========>>', this.foods[index]);
    if (this.foods[index].variations && this.foods[index].variations.length) {
      this.openVariations(index);
    } else {
      this.foods[index].quantiy = this.foods[index].quantiy + 1;
      this.calculate();
    }
  }

  removeQ(index) {
    if (this.foods[index].quantiy !== 0) {
      if (this.foods[index].quantiy >= 1 && !this.foods[index].size) {
        this.foods[index].quantiy = this.foods[index].quantiy - 1;
      } else {
        this.openVariations(index);
      }
    } else {
      this.foods[index].quantiy = 0;
    }
    this.calculate();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.translate('Warning'),
      message: this.util.translate(`you already have item's in cart with different restaurant`),
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Clear cart'),
          handler: () => {
            console.log('Confirm Okay');
            localStorage.removeItem('vid');
            this.dummy = Array(10);
            localStorage.removeItem('categories');
            localStorage.removeItem('dummyItem');
            localStorage.removeItem('foods');
            this.totalItem = 0;
            this.totalPrice = 0;
            this.getCates();
            this.getFoods();
          }
        }
      ]
    });

    await alert.present();
  }

  viewCart() {
    console.log('viewCart');
    this.setData();
    this.navCtrl.navigateRoot(['tabs/tab3']);
  }

  async presentPopover(ev: any) {
    if (this.categories.length <= 0) {
      return false;
    }
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      componentProps: { data: this.categories },
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        const yOffset = document.getElementById(data.data.id).offsetTop;
        const yHOffset = document.getElementById(data.data.id).offsetHeight;

        console.log(yOffset + ' : ' + yHOffset);
        this.content.scrollToPoint(0, yOffset, 1000);
      }
    });
    await popover.present();

  }

  openDetails() {
    const navData: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.router.navigate(['rest-details'], navData);
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
