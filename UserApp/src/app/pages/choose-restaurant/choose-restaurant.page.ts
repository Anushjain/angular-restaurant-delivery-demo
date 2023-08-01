import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-choose-restaurant',
  templateUrl: './choose-restaurant.page.html',
  styleUrls: ['./choose-restaurant.page.scss'],
})
export class ChooseRestaurantPage implements OnInit {
  restaurants: any[] = [];
  dummyRest: any = [];
  constructor(
    private router: Router,
    private api: ApisService) {

  }

  ngOnInit() {
    this.api.getVenues().then((data) => {
      console.log('dataa', data);
      if (data) {
        this.restaurants = [];
        this.dummyRest = [];
        data.forEach(element => {
          if (element && element.isClose === false) {
            this.restaurants.push(element);
            this.dummyRest.push(element);
          }
        });
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  goToAddReview(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['/add-review'], navData);
  }


  protected resetChanges = () => {
    this.restaurants = this.dummyRest;
  }

  setFilteredItems() {
    console.log('clear');
    this.restaurants = [];
    this.restaurants = this.dummyRest;
  }

  filterItems(searchTerm) {

    return this.restaurants.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  onSearchChange(event) {
    this.resetChanges();
    this.restaurants = this.filterItems(event.detail.value);
  }

}
