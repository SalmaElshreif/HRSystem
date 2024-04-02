import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../Services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthServiceService,
    private toast: NgToastService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.toast.error({ detail: 'خطأ', summary: 'برجاء قم بتسجيل الدخول أولاً' });
      return this.router.createUrlTree(['login']);
    }
  }


}
