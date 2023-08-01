import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewAddressPage } from './add-new-address.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewAddressPageRoutingModule {}
