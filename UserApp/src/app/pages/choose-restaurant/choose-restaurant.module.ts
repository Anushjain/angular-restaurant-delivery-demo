import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseRestaurantPageRoutingModule } from './choose-restaurant-routing.module';

import { ChooseRestaurantPage } from './choose-restaurant.page';
import { SharedModule } from 'src/app/directives/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseRestaurantPageRoutingModule,
    SharedModule
  ],
  declarations: [ChooseRestaurantPage]
})
export class ChooseRestaurantPageModule { }
