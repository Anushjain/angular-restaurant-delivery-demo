import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseAddressPageRoutingModule } from './choose-address-routing.module';

import { ChooseAddressPage } from './choose-address.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { SharedModule } from 'src/app/directives/shared.module';

@NgModule({
  entryComponents: [
    PopoverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseAddressPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ChooseAddressPage]
})
export class ChooseAddressPageModule { }
