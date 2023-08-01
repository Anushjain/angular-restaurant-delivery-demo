import { NgModule } from '@angular/core';
import { HideHeaderDirective } from './hide-header.directive';

@NgModule({
    declarations: [
        HideHeaderDirective
    ],
    exports: [
        HideHeaderDirective
    ]
})
export class HidenavModule { }