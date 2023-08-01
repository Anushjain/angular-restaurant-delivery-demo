import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.page.html',
  styleUrls: ['./foods.page.scss'],
})
export class FoodsPage implements OnInit {
  foods: any[] = [];
  categories: any[] = [];
  dummy = Array(50);
  constructor(
    private router: Router,
    private api: ApisService,
    private util: UtilService
  ) {

  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getFoods();
  }

  getFoods() {
    this.api.getVenueCategories(localStorage.getItem('uid')).then((data) => {
      console.log(data);
      this.dummy = [];
      if (data) {
        this.categories = data;
        this.api.getFoods(localStorage.getItem('uid')).then((data) => {
          console.log(data);
          if (data) {
            this.foods = data;
          }
        }, error => {
          console.log(error);
          this.dummy = [];
          this.util.errorToast(this.util.translate('Something went wrong'));
        }).catch(error => {
          this.dummy = [];
          console.log(error);
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
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
  addnew() {
    this.router.navigate(['/add-new-foods']);
  }

  foodsInfo(item) {
    console.log(item);
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['add-new-foods'], navData);
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
