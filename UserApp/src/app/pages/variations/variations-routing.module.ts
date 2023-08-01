import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VariationsPage } from './variations.page';

const routes: Routes = [
  {
    path: '',
    component: VariationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariationsPageRoutingModule {}
