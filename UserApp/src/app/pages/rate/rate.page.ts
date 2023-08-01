import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { orderBy, uniqBy } from 'lodash';
@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
  rate: any;
  driver: any = 3;
  items: any[] = [];
  dId: any;
  name: any;
  image: any;
  driverNotes: any;
  constructor(
    private api: ApisService,
    private util: UtilService,
    private adb: AngularFirestore,
    private navCtrl: NavController
  ) {
    const data = this.util.gerOrder();
    console.log(data);
    if (data) {
      this.items = JSON.parse(data.order);
      this.items = uniqBy(this.items, 'id');
      this.dId = data.dId.id;
      this.name = data.dId.fullname;
      this.image = data.dId.coverImage;
      console.log(this.items);
      this.items.forEach(element => {
        element.rate = 0;
        element.totalRatting = element.totalRatting ? element.totalRatting : 1;
      });
    }
  }

  submit() {
    console.log(this.items);
    this.items.forEach(async (element) => {
      console.log('elementt', element)
      let totalRatting = 0;
      totalRatting = (element.rate * element.totalRatting) / 100;
      console.log('???', totalRatting);
      totalRatting = totalRatting * 100;
      if (!totalRatting) {
        totalRatting = element.rate;
      }
      await this.adb.collection('foods').doc(element.uid).collection('all').doc(element.id).update({
        ratting: totalRatting,
        totalRatting: element.totalRatting + 1
      });
    });
    const id = Math.random().toString();
    console.log('iddddd', id);
    const uid = localStorage.getItem('uid');
    console.log('----->', localStorage.getItem('uid'));
    const parm = {
      id: id,
      descriptions: this.driverNotes,
      rate: this.driver,
      dId: this.dId,
      user: uid,
      uid: uid
    };
    console.log('parma ====>', parm);
    this.api.addDriverReview(parm).then((data) => {
      console.log('??????', data);
    }).catch(error => {
      console.log(error);
    });
    Swal.fire({
      title: 'Success',
      text: 'Thank you for submiting review',
      timer: 1000,
      backdrop: false,
      background: 'white',
      icon: 'success'
    });
    this.navCtrl.navigateRoot(['/tabs']);
  }
  ngOnInit() {
  }
  onRatingChange(event) {
    console.log(event);
  }
}
