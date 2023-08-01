import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripePaymentsPage } from './stripe-payments.page';

const routes: Routes = [
  {
    path: '',
    component: StripePaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripePaymentsPageRoutingModule {}
