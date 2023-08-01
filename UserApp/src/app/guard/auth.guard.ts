import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApisService } from '../services/apis.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authServ: ApisService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): any {
        return this.authServ.checkAuth().then((user: any) => {
            if (user) {
                localStorage.setItem('uid', user.uid);
                localStorage.setItem('help', user.uid);
                return true;
            } else {
                this.router.navigate(['login']);
            }
        }).catch(error => {
            console.log(error);
            this.router.navigate(['login']);
        });
    }
}
