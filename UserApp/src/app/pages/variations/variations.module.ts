import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariationsPageRoutingModule } from './variations-routing.module';

import { VariationsPage } from './variations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VariationsPageRoutingModule
  ],
  declarations: [VariationsPage]
})
export class VariationsPageModule {}
