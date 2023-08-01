import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestDetailsPage } from './rest-details.page';

const routes: Routes = [
  {
    path: '',
    component: RestDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestDetailsPageRoutingModule {}
