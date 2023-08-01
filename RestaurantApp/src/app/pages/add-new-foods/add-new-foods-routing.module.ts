import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewFoodsPage } from './add-new-foods.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewFoodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewFoodsPageRoutingModule {}
