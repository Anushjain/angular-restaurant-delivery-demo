import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariationPageRoutingModule } from './variation-routing.module';

import { VariationPage } from './variation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VariationPageRoutingModule
  ],
  declarations: [VariationPage]
})
export class VariationPageModule {}
