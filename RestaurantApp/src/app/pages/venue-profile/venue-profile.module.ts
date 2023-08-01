import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VenueProfilePageRoutingModule } from './venue-profile-routing.module';

import { VenueProfilePage } from './venue-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VenueProfilePageRoutingModule
  ],
  declarations: [VenueProfilePage]
})
export class VenueProfilePageModule {}
