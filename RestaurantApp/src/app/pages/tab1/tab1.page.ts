import { Component } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private api: ApisService,
    private router: Router
  ) { }
  logout() {
    this.api.logout().then(() => {
      localStorage.clear();
      this.router.navigate(['login']);
    })
  }
}
