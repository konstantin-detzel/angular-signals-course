import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const isUserAuthenticated: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    if (authService.isLoggedIn()) {
      return true;
    } else {
      return router.parseUrl("/login");
    }
  }
