import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApisService } from 'src/app/services/apis.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {
  cnumber: any = '';
  cname: any = '';
  cvc: any = '';
  date: any = '';
  email: any = '';
  constructor(
    private util: UtilService,
    private api: ApisService,
    private navCtrl: NavController
  ) {

  }

  ngOnInit() {
  }

  updateRest(body) {
    this.api.updateProfile(body.uid, body).then((data) => {
      console.log(data);
    });
    this.navCtrl.back();
  }

  addcard() {
    if (this.email === '' || this.cname === '' || this.cnumber === '' ||
      this.cvc === '' || this.date === '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.util.errorToast(this.util.translate('Please enter valid email'));
      return false;
    }
    const year = this.date.split('-')[0];
    const month = this.date.split('-')[1];
    const param = {
      'card[number]': this.cnumber,
      'card[exp_month]': month,
      'card[exp_year]': year,
      'card[cvc]': this.cvc
    };
    this.util.show();
    this.api.httpPost('https://api.stripe.com/v1/tokens', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        // this.token = data.id;
        const customer = {
          description: 'Customer for food app',
          source: data.id,
          email: this.email
        };
        this.api.httpPost('https://api.stripe.com/v1/customers', customer).subscribe((customer: any) => {
          console.log(customer);
          this.util.hide();
          if (customer && customer.id) {
            // this.cid = customer.id;
            const cid = {
              uid: localStorage.getItem('uid'),
              cid: customer.id
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
          this.util.errorToast(this.util.translate('Something went wrong'));
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
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

}
