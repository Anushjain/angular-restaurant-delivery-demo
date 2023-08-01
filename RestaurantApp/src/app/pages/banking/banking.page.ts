import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-banking',
  templateUrl: './banking.page.html',
  styleUrls: ['./banking.page.scss'],
})
export class BankingPage implements OnInit {
  number: any;
  cvc: any;
  date: any;
  token: any;
  name: any;
  email: any;
  cid: any;
  account_holder_name: any;
  routing_number: any;
  account_number: any;
  bid: any;
  constructor(
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }
  getMin() {
    return moment().format('YYYY-MM-DD');
  }
  getMax() {
    return moment().add('15', 'years').format('YYYY-MM-DD');
  }
  updateRest(body) {
    this.api.updateVenue(body).then((data) => {
      console.log(data);
    });
  }
  onslide2() {
    console.log(this.number, this.date, this.cvc);
    if (!this.number || !this.date || !this.cvc || !this.email || !this.name) {
      this.util.errorToast('All Fields are required');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.util.errorToast('Please enter valid email');
      return false;
    }

    const month = moment(this.date).format('MM');
    const year = moment(this.date).format('YYYY');
    const param = {
      'card[number]': this.number,
      'card[exp_month]': month,
      'card[exp_year]': year,
      'card[cvc]': this.cvc
    };
    console.log('parms', param);
    this.util.show();
    this.api.httpPost('https://api.stripe.com/v1/tokens', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.token = data.id;
        const customer = {
          description: 'Customer for food app',
          source: this.token,
          email: this.email
        };
        this.api.httpPost('https://api.stripe.com/v1/customers', customer).subscribe((customer: any) => {
          console.log(customer);
          this.util.hide();
          if (customer && customer.id) {
            this.cid = customer.id;
            const cid = {
              uid: localStorage.getItem('uid'),
              cid: this.cid
            };
            this.updateRest(cid);
          }
        }, error => {
          this.util.hide();
          console.log();
          if (error && error.error && error.error.error && error.error.error.message) {
            this.util.showErrorAlert(error.error.error.message);
            return false;
          }
          this.util.errorToast('Error \n Something went wrong');
        });
      } else {
        this.util.hide();
      }
    }, (error: any) => {
      console.log(error);
      this.util.hide();
      console.log();
      if (error && error.error && error.error.error && error.error.error.message) {
        this.util.showErrorAlert(error.error.error.message);
        return false;
      }
      this.util.errorToast('Error \n Something went wrong');
    });
  }

  createBankInfo() {
    if (!this.account_holder_name || !this.account_number || !this.routing_number) {
      this.util.errorToast('All Fields are required');
      return false;
    }
    console.log(this.account_holder_name, this.account_number, this.routing_number);
    const param = {
      'bank_account[country]': 'US',
      'bank_account[currency]': 'usd',
      'bank_account[account_holder_name]': this.account_holder_name,
      'bank_account[account_holder_type]': 'individual',
      'bank_account[routing_number]': this.routing_number,
      'bank_account[account_number]': '000' + this.account_number
    };
    this.util.show();
    this.api.httpPost('https://api.stripe.com/v1/tokens', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.bid = data.id;
        const bank = {
          source: this.bid
        }
        this.api.httpPost('https://api.stripe.com/v1/customers/' + this.cid, bank).subscribe((backRespone: any) => {
          console.log(backRespone);
          this.util.hide();
          const bid = {
            uid: localStorage.getItem('uid'),
            bid: backRespone.default_source
          };
          this.updateRest(bid);
          this.util.showToast('Account Created with stripe', 'success', 'bottom');
          this.navCtrl.back();
        }, error => {
          this.util.hide();
          console.log();
          if (error && error.error && error.error.error && error.error.error.message) {
            this.util.showErrorAlert(error.error.error.message);
            return false;
          }
          this.util.errorToast('Error \n Something went wrong');
        });
      }
    }, (error: any) => {
      console.log(error);
      this.util.hide();
      console.log();
      if (error && error.error && error.error.error && error.error.error.message) {
        this.util.showErrorAlert(error.error.error.message);
        return false;
      }
      this.util.errorToast('Error \n Something went wrong');
    });
  }
}
