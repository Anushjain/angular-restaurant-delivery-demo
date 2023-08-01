import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseAddressPage } from './choose-address.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseAddressPageRoutingModule {}
