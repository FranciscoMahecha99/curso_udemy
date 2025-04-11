import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      // logged in so return true
      this.authService.logout();
      return false;
    }
    let token = this.authService.token;
    if(!token){
      this.authService.logout();
      return false;
    }

    let expiration =(JSON.parse(atob(token.split('.')[1]))).exp;//Tiempo de expiración del token
    if(Math.floor(( new Date().getTime() )/1000) >= expiration){
      this.authService.logout();
      return false;
    }

    return true;

    // not logged in so redirect to login page with the return url
    // this.authService.logout();
    // return false;
  }
}
