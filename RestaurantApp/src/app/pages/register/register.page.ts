import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ActionSheetController } from '@ionic/angular';
import { Location } from '@angular/common';
import { register } from 'src/app/interfaces/register';
import { UtilService } from 'src/app/services/util.service';
import { ApisService } from 'src/app/services/apis.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  user: register = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    gender: 'male',
    phone: '',
    address: '',
    avatar: ''
  };
  slideOpts = {
    slidesPerView: 1,
    allowTouchMove: false
  };
  submitted = false;
  isLogin: boolean = false;
  constructor(
    private location: Location,
    private util: UtilService,
    private api: ApisService,
    private navCtrl: NavController
  ) {
  }

  ngOnInit() {
  }

  goNext() {
    this.slides.slideNext(500).then(d => console.log(d));
  }

  emailValidation() {
    console.log('user', this.user)
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (this.user.email === '' || !this.user.email) {
      this.util.showToast(this.util.translate('Please enter email'), 'danger', 'bottom');
      return false;
    }
    if (!(emailfilter.test(this.user.email))) {
      this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
      return false;
    }
    this.isLogin = true;
    this.api.checkEmail(this.user.email).then((datas: any) => {
      this.isLogin = false;
      if (!datas.length) {
        this.goNext();
      } else {
        this.util.hide();
        this.util.showErrorAlert(this.util.translate('this email id is already register, please use another to login'));
        return false;
      }
    }, error => {
      this.isLogin = false;
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch((error) => {
      this.isLogin = false;
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  prev() {
    this.slides.slidePrev(1000).then(d => console.log(d));
  }
  back() {
    this.location.back();
  }


  submit() {
    this.isLogin = true;
    this.api.register(this.user.email, this.user.password, this.user.first_name, this.user.last_name).then((data) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.uid) {
        localStorage.setItem('uid', data.uid);
        this.navCtrl.navigateRoot(['/']);
      }
    }).catch(error => {
      console.log(error);
      this.isLogin = false;
      this.util.showToast(`${error}`, 'danger', 'bottom');
    });
  }

}
