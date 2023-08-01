import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import * as  moment from 'moment';
import swal from 'sweetalert2';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-stripe-payments',
  templateUrl: './stripe-payments.page.html',
  styleUrls: ['./stripe-payments.page.scss'],
})
export class StripePaymentsPage implements OnInit {
  cid: any;
  cards: any[] = [];
  card_token: any;
  totalPrice: any = 0;
  totalItem: any = 0;
  serviceTax: any = 0;
  deliveryCharge: any = 5;
  grandTotal: any = 0;
  deliveryAddress: any;
  venueFCM: any = '';
  vid: any = '';
  payKey: any = '';
  coupon: any;
  dicount: any;
  cart: any[] = [];
  constructor(
    private router: Router,
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController,
  ) { }

  getCards() {
    this.api.httpGet('https://api.stripe.com/v1/customers/' + this.cid + '/sources?object=card').subscribe((cards: any) => {
      this.util.hide();
      console.log(cards);
      if (cards && cards.data) {
        this.cards = cards.data;
        this.card_token = this.cards[0].id;
      }
    }, (error) => {
      this.util.hide();
      console.log(error);
      this.util.hide();
      if (error && error.error && error.error.error && error.error.error.message) {
        this.util.showErrorAlert(error.error.error.message);
        return false;
      }
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getProfile() {
    this.util.show();
    console.log('loca', localStorage.getItem('uid'));
    this.api.getProfile(localStorage.getItem('uid')).then((data: any) => {
      console.log('data', data);
      if (data && data.cid) {
        this.cid = data.cid;
        this.getCards();
      } else {
        this.util.hide();
      }
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


  async ngOnInit() {
    const foods = await JSON.parse(localStorage.getItem('foods'));
    let recheck = await foods.filter(x => x.quantiy > 0);
    console.log(recheck);
    const add = JSON.parse(localStorage.getItem('deliveryAddress'));
    this.vid = localStorage.getItem('vid');
    this.api.getVenueUser(this.vid).then((data) => {
      console.log('venue', data);
      if (data && data.fcm_token) {
        this.venueFCM = data.fcm_token;
      }
    }, error => {
      this.util.errorToast(this.util.translate('Something went wrong'));
      this.router.navigate(['tabs']);
    }).catch(error => {
      this.util.errorToast(this.util.translate('Something went wrong'));
      this.router.navigate(['tabs']);
      console.log(error);
    });
    if (add && add.address) {
      this.deliveryAddress = add;
    }
    this.coupon = JSON.parse(localStorage.getItem('coupon'));
    const cart = localStorage.getItem('userCart');
    try {
      if (cart && cart !== 'null' && cart !== undefined && cart !== 'undefined') {
        this.cart = JSON.parse(localStorage.getItem('userCart'));
        this.calculate();
      } else {
        this.cart = [];
      }
    } catch (error) {
      console.log(error);
      this.cart = [];
    }
  }

  async calculate() {
    console.log('cart--->,', this.cart);
    // new
    let item = this.cart.filter(x => x.quantiy > 0);
    this.cart.forEach(element => {
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
    // new

    console.log('total item', this.totalItem);
    console.log('=====>', this.totalPrice);
    const tax = (parseFloat(this.totalPrice) * 21) / 100;
    this.serviceTax = tax.toFixed(2);
    console.log('tax->', this.serviceTax);
    this.deliveryCharge = 5;
    this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.deliveryCharge);
    this.grandTotal = this.grandTotal.toFixed(2);
    if (this.coupon && this.coupon.code && this.totalPrice >= this.coupon.min) {
      if (this.coupon.type === '%') {
        console.log('per');
        function percentage(num, per) {
          return (num / 100) * per;
        }
        const totalPrice = percentage(parseFloat(this.totalPrice).toFixed(2), this.coupon.discout);
        console.log('============>>>>>>>>>>>>>>>', totalPrice);
        this.dicount = totalPrice.toFixed(2);
        this.totalPrice = parseFloat(this.totalPrice) - totalPrice;
        console.log('------------>>>>', this.totalPrice);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
        const tax = (parseFloat(this.totalPrice) * 21) / 100;
        this.serviceTax = tax.toFixed(2);
        console.log('tax->', this.serviceTax);
        this.deliveryCharge = 5;
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.deliveryCharge);
        this.grandTotal = this.grandTotal.toFixed(2);
      } else {
        console.log('$');
        const totalPrice = parseFloat(this.totalPrice) - this.coupon.discout;
        console.log('============>>>>>>>>>>>>>>>', totalPrice);
        this.dicount = this.coupon.discout;
        this.totalPrice = totalPrice;
        console.log('------------>>>>', this.totalPrice);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
        const tax = (parseFloat(this.totalPrice) * 21) / 100;
        this.serviceTax = tax.toFixed(2);
        console.log('tax->', this.serviceTax);
        this.deliveryCharge = 5;
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.deliveryCharge);
        this.grandTotal = this.grandTotal.toFixed(2);
      }
    } else {
      console.log('not satisfied');
      this.coupon = null;
      localStorage.removeItem('coupon');
    }
    console.log('grand totla', this.grandTotal);
    if (this.totalItem === 0) {
      const lng = localStorage.getItem('language');
      const selectedCity = localStorage.getItem('selectedCity');
      await localStorage.clear();
      localStorage.setItem('language', lng);
      localStorage.setItem('selectedCity', selectedCity);
      this.totalItem = 0;
      this.totalPrice = 0;
    }
  }

  /// OLD calc
  // async calculate(foods) {
  //   console.log(foods);
  //   let item = foods.filter(x => x.quantiy > 0);
  //   console.log(item);
  //   this.totalPrice = 0;
  //   this.totalItem = 0;
  //   await item.forEach(element => {
  //     this.totalItem = this.totalItem + element.quantiy;
  //     this.totalPrice = this.totalPrice + (parseFloat(element.price) * parseInt(element.quantiy));
  //   });
  //   this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
  //   console.log('total item', this.totalItem);
  //   console.log('=====>', this.totalPrice);
  //   const tax = (parseFloat(this.totalPrice) * 21) / 100;
  //   this.serviceTax = tax.toFixed(2);
  //   console.log('tax->', this.serviceTax);
  //   this.deliveryCharge = 5;
  //   this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.deliveryCharge);
  //   this.grandTotal = this.grandTotal.toFixed(2);
  //   console.log('grand totla', this.grandTotal);
  //   if (this.coupon && this.coupon.code && this.totalPrice >= this.coupon.min) {
  //     if (this.coupon.type === '%') {
  //       console.log('per');
  //       function percentage(totalValue, partialValue) {
  //         return (100 * partialValue) / totalValue;
  //       }
  //       const totalPrice = percentage(parseFloat(this.totalPrice).toFixed(2), this.coupon.discout);
  //       console.log('============>>>>>>>>>>>>>>>', totalPrice);
  //       this.dicount = totalPrice.toFixed(2);
  //       this.totalPrice = parseFloat(this.totalPrice) - totalPrice;
  //       console.log('------------>>>>', this.totalPrice);
  //       this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
  //       const tax = (parseFloat(this.totalPrice) * 21) / 100;
  //       this.serviceTax = tax.toFixed(2);
  //       console.log('tax->', this.serviceTax);
  //       this.deliveryCharge = 5;
  //       this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.deliveryCharge);
  //       this.grandTotal = this.grandTotal.toFixed(2);
  //     } else {
  //       console.log('$');
  //       console.log('per');
  //       const totalPrice = parseFloat(this.totalPrice) - this.coupon.discout;
  //       console.log('============>>>>>>>>>>>>>>>', totalPrice);
  //       this.dicount = this.coupon.discout;
  //       this.totalPrice = parseFloat(this.totalPrice) - totalPrice;
  //       console.log('------------>>>>', this.totalPrice);
  //       this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
  //       const tax = (parseFloat(this.totalPrice) * 21) / 100;
  //       this.serviceTax = tax.toFixed(2);
  //       console.log('tax->', this.serviceTax);
  //       this.deliveryCharge = 5;
  //       this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.serviceTax) + parseFloat(this.deliveryCharge);
  //       this.grandTotal = this.grandTotal.toFixed(2);
  //     }
  //   } else {
  //     console.log('not satisfied');
  //     this.coupon = null;
  //     localStorage.removeItem('coupon');
  //   }
  // }

  // OLD calc

  payment() {
    console.log('place order');

    swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('Orders once placed cannot be cancelled and are non-refundable'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      cancelButtonText: this.util.translate('cancel'),
      showCancelButton: true,
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('go to procesed');
        const options = {
          amount: parseInt(this.grandTotal) * 100,
          currency: 'inr',
          customer: this.cid,
          card: this.card_token,
        };
        console.log('options', options);
        const url = 'https://api.stripe.com/v1/charges';
        this.util.show();
        this.api.httpPost(url, options).subscribe((data: any) => {
          console.log('------------------------->', data);
          this.payKey = data.id;
          this.util.hide();
          this.util.showToast(this.util.translate('Payment Success'), 'success', 'bottom');
          this.createOrder();
        }, (error) => {
          this.util.hide();
          console.log(error);
          this.util.hide();
          if (error && error.error && error.error.error && error.error.error.message) {
            this.util.showErrorAlert(error.error.error.message);
            return false;
          }
          this.util.errorToast('Something went wrong');
        });
      }
    });
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
  async createOrder() {
    this.util.show('creating order');
    this.api.checkAuth().then(async (data: any) => {
      console.log(data);
      if (data) {
        // not from saved address then create new and save
        if (!this.deliveryAddress.id || this.deliveryAddress.id === '') {
          const addressId = this.util.makeid(10);
          const newAddress = {
            id: addressId,
            uid: data.uid,
            address: this.deliveryAddress.address,
            lat: this.deliveryAddress.lat,
            lng: this.deliveryAddress.lng,
            title: 'home',
            house: '',
            landmark: ''
          };
          await this.api.addNewAddress(data.uid, addressId, newAddress).then((data) => {
            this.deliveryAddress.id = addressId;
          }, error => {
            console.log(error);
          }).catch(error => {
            console.log(error);
          });
        }
        // const foods = await JSON.parse(localStorage.getItem('foods'));
        // let recheck = await foods.filter(x => x.quantiy > 0);
        // console.log('ordered food', recheck);
        let id = this.util.makeid(10);
        await localStorage.removeItem('foods');
        await localStorage.removeItem('vid');
        await localStorage.removeItem('totalItem');
        const uid = localStorage.getItem('uid');
        const lng = localStorage.getItem('language');
        const selectedCity = localStorage.getItem('selectedCity');
        await localStorage.clear();
        localStorage.setItem('uid', uid);
        localStorage.setItem('language', lng);
        localStorage.setItem('selectedCity', selectedCity);
        const param = {
          uid: data.uid,
          userId: data.uid,
          orderId: id,
          vid: this.vid,
          order: JSON.stringify(this.cart),
          time: moment().format('llll'),
          address: this.deliveryAddress,
          total: this.totalPrice,
          grandTotal: this.grandTotal,
          serviceTax: this.serviceTax,
          deliveryCharge: 5,
          status: 'created',
          restId: this.vid,
          paid: 'stripe',
          paykey: this.payKey,
          appliedCoupon: this.coupon ? true : false,
          couponId: this.coupon ? this.coupon.id : 'NA',
          coupon: this.coupon ? JSON.stringify(this.coupon) : 'NA',
          dicount: this.coupon ? this.dicount : 0
        };
        console.log('sent', param);
        this.api.createOrder(id, param).then(async (data) => {
          this.util.hide();
          if (this.venueFCM && this.venueFCM !== '') {
            this.api.sendNotification(this.util.translate('New Order Received'),
              this.util.translate('New Order'), this.venueFCM).subscribe((data) => {
                console.log('send notifications', data);
              }, error => {
                console.log(error);
              });
          }
          swal.fire({
            title: this.util.translate('Success'),
            text: this.util.translate('Your is created succesfully'),
            icon: 'success',
            backdrop: false,
          });
          this.navCtrl.navigateRoot(['tabs/tab2']);
          console.log(data);
        }, error => {
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
          this.router.navigate(['tabs']);
        }).catch(error => {
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
          this.router.navigate(['tabs']);
          console.log(error);
        });
      } else {
        this.util.hide();
        this.util.errorToast(this.util.translate('Session expired'));
        this.router.navigate(['login']);
      }

    }, error => {
      this.util.hide();
      this.util.errorToast(this.util.translate('Session expired'));
      this.router.navigate(['login']);
    }).catch(error => {
      this.util.hide();
      this.util.errorToast(this.util.translate('Session expired'));
      this.router.navigate(['login']);
      console.log(error);
    });

  }

  ionViewWillEnter() {
    this.getProfile();
  }

  onAdd() {
    this.router.navigate(['add-card']);
  }
  changeMethod(id) {
    this.card_token = id;
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
