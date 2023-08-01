import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(
        private navCtrl: NavController
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const selectedCity = localStorage.getItem('selectedCity');
        console.log('selectedCity', localStorage.getItem('selectedCity'));
        if (selectedCity && selectedCity != null && selectedCity !== 'null') {
            return true;
        }
        this.navCtrl.navigateRoot(['/cities']);
        return false;
    }
}
