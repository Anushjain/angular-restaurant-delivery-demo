import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-variations',
  templateUrl: './variations.page.html',
  styleUrls: ['./variations.page.scss'],
})
export class VariationsPage implements OnInit {
  productName: any = '';
  desc: any = '';
  total: any = 0;
  lists: any;
  cart: any[] = [];
  userCart: any[] = [];

  sameProduct: boolean = false;
  removeProduct: boolean = false;

  radioSelected: any;
  haveSize: boolean;


  newItem: boolean = false;

  sameCart: any[] = [];
  constructor(
    private modalController: ModalController,
    private navParma: NavParams,
    private util: UtilService
  ) {
    const info = this.navParma.get('food');
    console.log('info', info);
    this.productName = info.name;
    this.desc = info.desc;
    this.lists = info.variations;
    const userCart = localStorage.getItem('userCart');
    this.haveSize = info.size;
    console.log('usercart---->', userCart);
    if (userCart && userCart !== 'null' && userCart !== undefined && userCart !== 'undefined') {
      this.userCart = JSON.parse(userCart);
      console.log('===>>', this.userCart);
      const sameItem = this.userCart.filter(x => x.id === info.id);
      console.log('sameItem', sameItem);
      if (sameItem.length > 0) {
        this.sameProduct = true;
        this.sameCart = sameItem[0].selectedItem;
        console.log('=??==>asdasd-->>>asd>>>>', this.sameCart);
      }
    } else {
      this.userCart = [];
    }
  }

  ngOnInit() {
  }
  closeIt() {
    this.modalController.dismiss();
  }

  radioGroupChange(event, title) {
    console.log(event, title);

    console.log(this.lists);
    const radioList = this.lists.filter(x => x.title === title);
    console.log(radioList);
    const selectedItems = radioList[0].items.filter(x => x.title === event.detail.value);
    console.log('selected item', selectedItems);
    const price = parseFloat(selectedItems[0].price);
    const param = {
      type: title,
      value: price,
      name: selectedItems[0].title
    };
    const item = this.cart.filter(x => x.type === title);
    // console.log(item);

    if (item && item.length) {
      const index = this.cart.findIndex(x => x.type === title);
      this.cart[index].value = price;
    } else {
      this.cart.push(param);
    }
    console.log('cart', this.cart);
    console.log('ng model', this.radioSelected);
  }


  getSymobol() {
    return this.util.getCurrecySymbol();
  }
  sameChoise() {
    this.modalController.dismiss(this.sameCart, 'sameChoice');
  }
  addToCart() {
    /*
      new
      sameChoice
      newCustom
      remove
    */

    const addedSize = this.cart.filter(x => x.type === 'size');
    console.log(addedSize);
    let role;
    if (this.haveSize && !addedSize.length) {
      console.log('no size added');
      this.util.errorToast('Please select size');
      return false;
    }
    if (this.cart.length && !this.userCart.length) {
      role = 'new';
    }
    if (this.cart.length && this.userCart.length) {
      role = 'new';
    }
    if (!this.cart.length) {
      role = 'dismissed';
    }
    if (this.newItem) {
      role = 'newCustom';
    }
    this.modalController.dismiss(this.cart, role);
  }

  checkedEvent(event, title) {
    console.log(event, title);
    const price = parseFloat(event.detail.value);
    const param = {
      type: title,
      value: price,
      name: title
    };
    if (event.detail && event.detail.checked) {
      this.cart.push(param);
    } else {
      this.cart = this.cart.filter(x => x.type !== title);
    }
    console.log(this.cart);
  }

  addQ(index) {
    // this.userCart[index].quantiy = this.userCart[index].quantiy + 1;
    this.sameCart[index].total = this.sameCart[index].total + 1;
  }

  removeQ(index) {
    // if (this.userCart[index].quantiy !== 0) {
    //   this.userCart[index].quantiy = this.userCart[index].quantiy - 1;
    //   if (this.userCart[index].quantiy === 0) {
    //     this.modalController.dismiss(this.cart, 'remove');
    //   }
    // }
    this.sameCart[index].total = this.sameCart[index].total - 1;
    if (this.sameCart[index].total === 0) {
      this.sameCart = this.sameCart.filter(x => x.total !== 0);
    }

    if (this.sameCart.length < 0) {
      this.modalController.dismiss(this.cart, 'remove');
    }
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
