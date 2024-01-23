//Se importa esta librería para poder inyectar dependencias sin constructor de clase

import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

const checkAuthentication = (): Observable<boolean> | boolean => {

  //se inyectan el AuthService y el Router

  const authService: AuthServiceService = inject(AuthServiceService);
  const router: Router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    })

  );

}; 

//No hay necesidad de crear una clase, simplemente definiendo una función flecha y exportándola, podemos utilizar sus funcionalidades de guard en el app-routing

export const canActivateGuard: CanActivateFn = (

  //Hay que tener en cuenta el tipado CanActiveFn

  route: ActivatedRouteSnapshot,

  state: RouterStateSnapshot

) => {

  return checkAuthentication();

}; 

export const canMatchGuard: CanMatchFn = (
  //Tipado CanMatchFN
  route: Route,
  segments: UrlSegment[]
) => {

  return checkAuthentication();

};

