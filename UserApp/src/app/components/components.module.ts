


// This File Is Required For Custom Components

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../directives/shared.module';
const components = [
    PopoverComponent,
    MenuComponent
];
@NgModule({
    declarations: [
        components
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        SharedModule
    ],
    exports: [
        ...components,
    ]
})
export class ComponentsModule { }
