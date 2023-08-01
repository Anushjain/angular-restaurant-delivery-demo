import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-rest-details',
  templateUrl: './rest-details.page.html',
  styleUrls: ['./rest-details.page.scss'],
})
export class RestDetailsPage implements OnInit {
  slideOpts = {
    slidesPerView: 2.3,
  };
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
  images: any[] = [];
  isOpen: boolean = false;
  open: any;
  close: any;
  email: any;
  phone: any;
  constructor(
    private route: ActivatedRoute,
    private api: ApisService,
    private util: UtilService
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
        this.open = data.openTime;
        this.close = data.closeTime;
        this.email = data.email;
        this.phone = data.phone;
        this.time = data.time;
        this.cusine = data.cusine;
        this.images = data.images;
        this.isOpen = data.status === 'open' ? true : false;
        this.images.forEach((element, i) => {
          if (element === '' || !element) {
            this.images[i] = 'assets/imgs/food.jpg';
          }
        });
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

}
