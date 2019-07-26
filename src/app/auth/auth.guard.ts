import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map, mergeAll} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Plugins } from '@capacitor/core';
import { AppState } from '../reducers';
import { isLoggedIn } from './auth.selectors';
import { Login, Logout } from './auth.actions';

const { Storage } = Plugins;



@Injectable()
export class AuthGuard implements CanActivate {


  constructor(
    private store: Store<AppState>
  ) {
  }


  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean>  {
    return this.store.pipe(
      select(isLoggedIn),
      map(loggedIn => {
        if (!loggedIn) {
          return Storage.get({ key: 'user' });
        }
        return new Promise(resolve => {
          resolve(true);
        });
      }),
      mergeAll(),
      map((data: any) => {
        if (!data) {
          console.log('reaching auth guard logout action I');
          this.store.dispatch(new Logout());
          return false;
        }
        const user = JSON.parse(data);
        if (typeof user === 'object') {
          if (user && 'is_active' in user && user.is_active) {
            console.log('triggering auth guard');
            this.store.dispatch(new Login({user}));
            return true;
          } else {
            console.log('reaching auth guard logout action II', user);
            this.store.dispatch(new Logout());
            return false;
          }
        }
        return true;
      })
    );
  }

}
