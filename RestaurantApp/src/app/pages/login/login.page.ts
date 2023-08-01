import { Component, OnInit } from '@angular/core';
import { login } from 'src/app/interfaces/login';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: login = { email: 'tulsi@gmail.com', password: '123456' };
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
    this.oneSignal.getIds().then((data) => {
      console.log('iddddd', data);
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
        if (userData && userData.uid) {
          this.api.getProfile(userData.uid).then(data => {
            console.log('data', data);
            this.isLogin = false;
            if (data && data.type === 'venue') {
              if (data && data.status === 'active') {
                localStorage.setItem('uid', userData.uid);
                localStorage.setItem('help', userData.uid);
                this.navCtrl.navigateRoot(['/']);
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
                // this.util.errorToast('Your are blocked please contact administrator');
              }
            } else {
              this.util.showToast(this.util.translate('your not valid user'), 'danger', 'bottom');
            }
          }).catch(error => {
            this.isLogin = false;
            console.log(error);
            this.util.showToast(`${error}`, 'danger', 'bottom');
          });
        }
      }).catch(err => {
        this.isLogin = false;
        if (err) {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        }
      });
    }
  }

  resetPass() {
    this.router.navigate(['reset']);
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
