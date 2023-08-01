import { Component, OnInit } from '@angular/core';
import { login } from 'src/app/interfaces/login';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: login = { email: '', password: '' };
  submitted = false;
  isLogin: boolean = false;
  constructor(
    private router: Router,
    private api: ApisService,
    private util: UtilService,
    private navCtrl: NavController,
    private translate: TranslateService,
    private oneSignal: OneSignal
  ) {
    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      localStorage.setItem('language', 'en');
    }
    this.translate.use(localStorage.getItem('language'));
    this.oneSignal.getIds().then((data) => {
      console.log('iddddd==========', data);
      localStorage.setItem('fcm', data.userId);
    });
  }

  ngOnInit() {

  }

  onLogin(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }
      console.log('login');
      this.isLogin = true;
      this.api.login(this.login.email, this.login.password).then((userData) => {
        console.log(userData);
        this.api.getProfile(userData.uid).then((info) => {
          console.log(info);
          if (info && info.status === 'active') {
            localStorage.setItem('uid', userData.uid);
            localStorage.setItem('help', userData.uid);
            this.isLogin = false;
            this.util.publishLoggedIn('LoggedIn');
            // this.navCtrl.back();
            this.router.navigate(['/']);
          } else {
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
                localStorage.setItem('help', userData.uid);
                this.router.navigate(['inbox']);
              }
            });
          }
        }).catch(err => {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        });
      }).catch(err => {
        if (err) {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        }
      }).then(el => this.isLogin = false);
    }
  }

  resetPass() {
    this.router.navigate(['/forgot']);
  }

  register() {
    this.router.navigate(['register']);
  }

  getClassName() {
    return localStorage.getItem('language');
  }
  changeLng(lng) {
    localStorage.setItem('language', lng);
    this.translate.use(lng);
  }
}
