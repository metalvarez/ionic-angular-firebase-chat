import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';


export const selectAuthState = state => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  authState => authState.loggedIn === true
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);

export const getUserFromStore = createSelector(
  selectAuthState,
  authState => {
    /**
     * This validation is probably not neccessary as the AuthGuard is going to prevent calling this selector without having a valid session
     */
    if (authState.user !== undefined) {
      return authState.user;
    }
    return undefined;
  }
);
