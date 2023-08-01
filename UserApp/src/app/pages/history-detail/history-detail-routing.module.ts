import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryDetailPage } from './history-detail.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryDetailPageRoutingModule {}
