import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Login, AuthActionTypes, Logout } from './auth.actions';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { defer, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;



@Injectable()
export class AuthEffects {

  @Effect({dispatch: false})
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.LoginAction),
    tap(action => {
      console.log('saving user in login effect', action.payload.user);
      Storage.set({
        key: 'user',
        value: JSON.stringify(action.payload.user)
      });
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    })
  );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.LogoutAction),
    tap(async (action) => {
      this.router.navigateByUrl('/login');
    })
  );

  @Effect()
  init$ = defer((): Observable<Action> => {
    const userData = localStorage.getItem('user');
    console.log('user table from local storage');
    console.log(userData);
    if (userData) {
      const user = {user: JSON.parse(userData)};
      if (user.user.is_active) {
        console.log('triggering login from init effect');
        return of(new Login(user));
      }
    }
  });

  constructor(
    private actions$: Actions,
    private router: Router) {}

}
