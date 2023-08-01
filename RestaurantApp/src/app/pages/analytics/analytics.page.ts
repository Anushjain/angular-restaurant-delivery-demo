import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels = [this.util.translate('New Orders'), this.util.translate('Completed'),
  this.util.translate('On Going'), this.util.translate('Others')];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', '#e61212'],
    },
  ];
  totalEarning: any = 0;
  loaded: boolean;
  report: any = 'all';
  allOrders: any[] = [];
  constructor(
    private api: ApisService,
    private util: UtilService,
    private router: Router
  ) {
    this.loaded = false;
  }


  ngOnInit() {
  }
  ionViewWillEnter() {
    this.api.getVenueDetails(localStorage.getItem('uid')).then(data => {
      console.log(data);
      if (!data) {
        console.log('no data');
        this.util.showSimpleAlert(this.util.translate('Please create your venue profile first'));
        this.router.navigate(['venue-profile']);
      } else {
        this.getOrders();
      }
    }).catch(error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }

  getOrders() {
    console.log('vid', localStorage.getItem('uid'));
    this.api.getMyOrders(localStorage.getItem('uid')).then((data) => {
      this.loaded = true;
      console.log('orders', data);
      if (data && data.length > 0) {
        this.allOrders = data;

        let newOrders = [];
        let onGoingOrders = [];
        let oldOrders = [];
        let others = [];
        this.totalEarning = 0;
        data.forEach(element => {
          element.order = JSON.parse(element.order);
          this.totalEarning = this.totalEarning + parseFloat(element.grandTotal);
          if (element.status === 'created') {
            newOrders.push(element);
          } else if (element.status === 'accepted' || element.status === 'ongoing') {
            onGoingOrders.push(element);
          } else if (element.status === 'delivered') {
            oldOrders.push(element);
          } else if (element.status === 'cancel') {
            others.push(element);
          }
        });
        this.totalEarning = parseFloat(this.totalEarning).toFixed(2);
        console.log('new order', newOrders);
        this.pieChartData = [];
        this.pieChartData.push(newOrders.length); // new orders
        this.pieChartData.push(oldOrders.length); // completed
        this.pieChartData.push(onGoingOrders.length); // ongoing
        this.pieChartData.push(others.length); // others
        console.log('pi data', this.pieChartData);
      } else {
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
      }
    }, err => {
      console.log(err);
      this.loaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(e => {
      this.util.hide();
      this.loaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  changeMode() {
    console.log(this.report);
    if (this.report === 'now') {
      console.log('crren mnth', this.allOrders);
      const currentMonth = moment().format('MM');
      console.log('currentMonth', currentMonth);
      if (this.allOrders.length) {
        let newOrders = [];
        let onGoingOrders = [];
        let oldOrders = [];
        let others = [];
        this.totalEarning = 0;
        this.allOrders.forEach(element => {
          let orderMonth = moment(element.time).format('MM');
          console.log('ordermonth', orderMonth);
          if (currentMonth === orderMonth) {
            this.totalEarning = this.totalEarning + parseFloat(element.grandTotal);
            if (element.status === 'created') {
              newOrders.push(element);
            } else if (element.status === 'accepted' || element.status === 'ongoing') {
              onGoingOrders.push(element);
            } else if (element.status === 'delivered') {
              oldOrders.push(element);
            } else if (element.status === 'cancel') {
              others.push(element);
            }
          }
        });
        this.totalEarning = parseFloat(this.totalEarning).toFixed(2);
        console.log('new order', newOrders);
        this.pieChartData = [];
        this.pieChartData.push(newOrders.length); // new orders
        this.pieChartData.push(oldOrders.length); // completed
        this.pieChartData.push(onGoingOrders.length); // ongoing
        this.pieChartData.push(others.length); // others
        console.log('pi data', this.pieChartData);
      } else {
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
      }
    } else {
      if (this.allOrders.length) {
        let newOrders = [];
        let onGoingOrders = [];
        let oldOrders = [];
        let others = [];
        this.totalEarning = 0;
        this.allOrders.forEach(element => {

          this.totalEarning = this.totalEarning + parseFloat(element.grandTotal);
          if (element.status === 'created') {
            newOrders.push(element);
          } else if (element.status === 'accepted' || element.status === 'ongoing') {
            onGoingOrders.push(element);
          } else if (element.status === 'delivered') {
            oldOrders.push(element);
          } else if (element.status === 'cancel') {
            others.push(element);
          }
        });
        console.log('new order', newOrders);
        this.pieChartData = [];
        this.pieChartData.push(newOrders.length); // new orders
        this.pieChartData.push(oldOrders.length); // completed
        this.pieChartData.push(onGoingOrders.length); // ongoing
        this.pieChartData.push(others.length); // others
        console.log('pi data', this.pieChartData);
      } else {
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
      }
    }
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }
}
