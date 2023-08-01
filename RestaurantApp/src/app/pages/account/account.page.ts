import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  seg_id = 1;
  reviews: any[] = [];
  name: any = '';
  images: any[] = [];
  cover: any = '';
  address: any = '';
  open: any = '';
  close: any = '';
  constructor(
    private router: Router,
    private api: ApisService,
    private navCtrl: NavController,
    private util: UtilService
  ) {
    this.util.obserProfile().subscribe(data => {
      this.getProfile();
    });
  }

  ngOnInit() {
    this.getReviews();
  }

  getProfile() {
    this.api.getVenueDetails(localStorage.getItem('uid')).then(data => {
      console.log('details', data);
      if (!data) {
        console.log('no data');
        this.util.showSimpleAlert(this.util.translate('Please create your venue profile first'));
        this.router.navigate(['venue-profile']);
      } else {
        this.name = data.name;
        this.address = data.address;
        this.cover = data.cover;
        this.images = data.images;
        this.open = data.openTime;
        this.close = data.closeTime;
        if (this.open === 'Invalid date') {
          this.open = '10:00 AM';
        }
        if (this.close === 'Invalid date') {
          this.close = '10:00 PM';
        }
      }
    }).catch(error => {
      console.log(error);
      this.util.showToast(this.util.translate('Something went wrong'), 'danger', 'bottom');
    });
  }
  ionViewWillEnter() {

    this.getProfile();
  }

  getReviews() {
    this.api.getMyReviews(localStorage.getItem('uid')).then((data) => {
      console.log('reviews', data);
      if (data) {
        this.reviews = data;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  goToAddCategoty() {
    this.router.navigate(['/category']);
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  goToOrder() {
    this.router.navigate(['/orders']);
  }


  AddFoods() {
    this.router.navigate(['/foods']);
  }
  venueDetails() {
    this.router.navigate(['venue-profile']);
  }

  logout() {
    this.api.logout().then(() => {
      this.navCtrl.navigateRoot(['login']);
    });
  }

  changeSegment(val) {
    this.seg_id = val;
  }
}
