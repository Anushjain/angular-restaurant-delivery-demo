
import { NgModule } from '@angular/core';
import { HidenavModule } from './hidenav.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [HidenavModule, CommonModule],
    exports: [HidenavModule, TranslateModule]
})
export class SharedModule { }
