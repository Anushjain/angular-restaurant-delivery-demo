import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  seg_id = 1;

  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy = Array(50);
  constructor(
    private api: ApisService,
    private util: UtilService,
    private router: Router,
    private adb: AngularFirestore
  ) {
    if (localStorage.getItem('uid')) {
      this.adb.collection('orders', ref =>
        ref.where('restId', '==', localStorage.getItem('uid'))).snapshotChanges().subscribe((data: any) => {
          console.log('---->', data);
          if (data) {
            this.getOrders();
          }
        });
    }
  }

  ngOnInit() {
    console.log('init');
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }
  ionViewWillEnter() {
    console.log('enter');
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.dummy = Array(50);
    this.api.getVenueDetails(localStorage.getItem('uid')).then(data => {
      console.log(data);
      if (!data) {
        console.log('no data');
        this.util.showSimpleAlert('Please create your venue profile first');
        this.router.navigate(['venue-profile']);
        this.dummy = [];
      } else if (data.status === 'close') {
        this.router.navigate(['login']);
        localStorage.removeItem('uid');
        Swal.fire({
          title: this.util.translate('Error'),
          text: this.util.translate('Your are blocked please contact administrator'),
          icon: 'error',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: this.util.translate('Need Help?'),
          backdrop: false,
          background: 'white'
        }).then(data => {
          if (data && data.value) {
            this.router.navigate(['inbox']);
          }
        });
      } else {
        this.getOrders();
      }
    }).catch(error => {
      this.dummy = [];
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }

  onClick(val) {
    this.seg_id = val;
  }

  goToOrderDetail(ids) {

    console.log(ids);

    const navData: NavigationExtras = {
      queryParams: {
        id: ids
      }
    };
    this.router.navigate(['/order-detail'], navData);
  }

  getOrders() {
    console.log('vid', localStorage.getItem('uid'));
    this.dummy = Array(50);
    this.api.getMyOrders(localStorage.getItem('uid')).then((data) => {
      this.dummy = [];
      console.log('orders', data);
      if (data && data.length > 0) {
        this.newOrders = [];
        this.onGoingOrders = [];
        this.oldOrders = [];
        data.forEach(element => {
          element.order = JSON.parse(element.order);
          if (element.status === 'created') {
            this.newOrders.push(element);
          } else if (element.status === 'accepted' || element.status === 'ongoing') {
            this.onGoingOrders.push(element);
          } else if (element.status === 'delivered' || element.status === 'cancel' || element.status === 'rejected') {
            this.oldOrders.push(element);
          }
        });
        console.log('new order', this.newOrders);
      }
    }, err => {
      console.log(err);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(e => {
      console.log(e);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  getProfilePic(item) {
    return item && item.cover ? item.cover : 'assets/imgs/user.jpg';
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
  
}
