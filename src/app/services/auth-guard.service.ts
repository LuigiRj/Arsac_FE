import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from "@angular/router/router";
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private utilsService: UtilsService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const grant = route.data.grant || [...state.url.substring(1).split('/'), '*'].join(':') || '*';
    const can = await this.authService.can(grant);
    if (!can && !this.authService.isAuthenticated()) {
      this.utilsService.notificationsService.error("Devi essere autenticato");
      this.authService.setLoginRedirect(state.url);
      this.router.navigateByUrl('/?next=' + state.url);
      return false;
    }
    if (!can) {
      this.utilsService.notificationsService.error("Non hai il permesso di accedere alla pagina richiesta");
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const grant = route.data.grant || [...state.url.substring(1).split('/'), '*'].join(':') || '*';
    const can = await this.authService.can(grant);
    if (!can && !this.authService.isAuthenticated()) {
      this.utilsService.notificationsService.error("Devi essere autenticato");
      this.authService.setLoginRedirect(state.url);
      this.router.navigateByUrl('/?next=' + state.url);
      return false;
    }
    if (!can) {
      this.utilsService.notificationsService.error("Non hai il permesso di accedere alla pagina richiesta");
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

}
