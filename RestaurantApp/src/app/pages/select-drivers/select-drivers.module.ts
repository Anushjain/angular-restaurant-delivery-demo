import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDriversPageRoutingModule } from './select-drivers-routing.module';

import { SelectDriversPage } from './select-drivers.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SelectDriversPageRoutingModule
  ],
  declarations: [SelectDriversPage]
})
export class SelectDriversPageModule {}
