import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {
  productName: any = '';
  desc: any = '';
  lists: any;
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private util: UtilService
  ) {
    this.productName = this.navParams.get('name');
    this.desc = this.navParams.get('desc');
    this.lists = this.navParams.get('variations');
  }

  ngOnInit() {
  }

  closeIt() {
    console.log('it');
    this.modalController.dismiss();
  }

  getCurrency() {
    return this.util.getCurrecySymbol();
  }

}
