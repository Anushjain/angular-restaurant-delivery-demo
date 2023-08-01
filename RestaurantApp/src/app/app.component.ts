import { Component } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { UtilService } from './services/util.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private oneSignal: OneSignal,
    private translate: TranslateService,
    private nativeAudio: NativeAudio,
    private actionSheetController: ActionSheetController,
    private util: UtilService
  ) {

    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      localStorage.setItem('language', 'en');
    }
    this.translate.use(localStorage.getItem('language'));
    this.initializeApp();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('New Notification'),
      mode: 'md',
      buttons: [{
        text: this.util.translate('OK'),
        icon: 'volume-mute',
        handler: () => {
          console.log('Delete clicked');
          this.nativeAudio.stop('audio').then(() => console.log('done'), () => console.log('error'));
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.nativeAudio.stop('audio').then(() => console.log('done'), () => console.log('error'));
        }
      }]
    });

    await actionSheet.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('appid', environment.onesignal.appId);
      console.log('googlenumnner', environment.onesignal.googleProjectNumber);
      setTimeout(async () => {
        await this.oneSignal.startInit(environment.onesignal.appId, environment.onesignal.googleProjectNumber);
        this.oneSignal.getIds().then((data) => {
          console.log('iddddd', data);
          localStorage.setItem('fcm', data.userId);
        });
        this.oneSignal.enableSound(true);
        await this.oneSignal.endInit();

      }, 1000);
      this.nativeAudio.preloadSimple('audio', 'assets/alert.mp3').then((data: any) => {
        console.log('dupletx', data);
      }, error => {
        console.log(error);
      }).catch(error => {
        console.log(error);
      });
      this.oneSignal.handleNotificationReceived().subscribe(data => {
        console.log('got order', data);
        this.nativeAudio.play('audio', () => console.log('audio is done playing')).catch(error => console.log(error));
        this.nativeAudio.setVolumeForComplexAsset('audio', 1);
        this.presentActionSheet();
      });
      this.oneSignal.inFocusDisplaying(2);
      this.platform.backButton.subscribe(async () => {
        console.log('asd', this.router.url, 'ad', this.router.isActive('/tabs/', true));
        if (this.router.url.includes('/tabs/') || this.router.url.includes('/login')) {
          navigator['app'].exitApp();
        }
      });
      this.statusBar.backgroundColorByHexString('#ff384c');
      this.splashScreen.hide();
    });
  }
}
