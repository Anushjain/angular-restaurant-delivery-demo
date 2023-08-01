import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseRestaurantPage } from './choose-restaurant.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseRestaurantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseRestaurantPageRoutingModule {}
