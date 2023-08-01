import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectDriversPage } from './select-drivers.page';

const routes: Routes = [
  {
    path: '',
    component: SelectDriversPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectDriversPageRoutingModule {}
