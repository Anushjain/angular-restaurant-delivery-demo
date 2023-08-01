import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCardPage } from './add-card.page';

const routes: Routes = [
  {
    path: '',
    component: AddCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCardPageRoutingModule {}
