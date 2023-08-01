import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage implements OnInit {
  cities: any[] = [];
  dummy = Array(10);
  dummyList: any[] = [];
  selectedCity: any;
  constructor(
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController,
    private translate: TranslateService,
  ) {
    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      localStorage.setItem('language', 'en');
    }
    this.translate.use(localStorage.getItem('language'));
    this.getCities();
  }
  getCities() {
    this.api.getCities().then((data) => {
      console.log(data);
      this.dummy = [];
      if (data && data.length) {
        data.forEach(element => {
          if (element && element.status === 'active') {
            this.cities.push(element);
            this.dummyList.push(element);
          }
        });
      }
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
      this.dummy = [];
    });
  }

  ngOnInit() {
  }
  goNext() {
    console.log('next', this.selectedCity);
    const data = this.cities.filter(x => x.id === this.selectedCity);
    console.log(data);
    localStorage.setItem('selectedCity', JSON.stringify(data[0]));
    this.util.publishLocation('data');
    this.navCtrl.navigateRoot(['/tabs']);
  }
  getClassName() {
    return localStorage.getItem('language');
  }
  changeLng(lng) {
    localStorage.setItem('language', lng);
    this.translate.use(lng);
  }
}
