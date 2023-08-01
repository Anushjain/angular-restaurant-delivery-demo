import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  cates: any;
  constructor(
    private navParam: NavParams,
    private popoverController: PopoverController
  ) {
    this.cates = this.navParam.get('data');
  }

  ngOnInit() { }
  selected(item) {
    this.popoverController.dismiss(item, 'selected');
  }
}
