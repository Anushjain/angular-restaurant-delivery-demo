import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VariationPage } from './variation.page';

const routes: Routes = [
  {
    path: '',
    component: VariationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariationPageRoutingModule {}
