import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenueProfilePage } from './venue-profile.page';

const routes: Routes = [
  {
    path: '',
    component: VenueProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VenueProfilePageRoutingModule {}
