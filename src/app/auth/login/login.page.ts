import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppState } from 'src/app/reducers';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import { Login, Logout } from 'src/app/auth/auth.actions';
import { PreviousRouteService } from 'src/app/shared/previous-route.service';
import { noop, fromEvent, Subscription } from 'rxjs';
import { isLoggedIn } from 'src/app/auth/auth.selectors';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loginSubscription: Subscription;
  errorMessage: string;
  passwordType = 'password';
  showPassword = false;
  showFooter = true;
  validationMessages = {
    email: [
      { type: 'required', message: this.translator.instant('Email is required.') },
      { type: 'pattern', message: this.translator.instant('Please enter a valid email.') }
    ],
    password: [
      { type: 'required', message: this.translator.instant('Password is required.') },
      { type: 'minlength', message: this.translator.instant('Password must be at least 5 characters long.') }
    ]
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private translator: TranslateService,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit() {
    fromEvent(window, 'keyboardWillShow').subscribe(() => {
      this.showFooter = false;
    });
    fromEvent(window, 'keyboardWillHide').subscribe(() => {
      this.showFooter = true;
    });
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.loginSubscription = this.store.pipe(
      select(isLoggedIn),
      tap(async (loggedIn) => {
        if (!loggedIn) {
          const user = await Storage.get({ key: 'user' });
          if (_.isEmpty(user)) {
            return;
          }
          this.router.navigateByUrl('home');
          return;
        }
        const previousRoute = this.previousRouteService.getPreviousUrl();
        console.log(previousRoute, isLoggedIn);
        if (previousRoute === '/home') {
          localStorage.removeItem('user');
          Storage.remove({
            key: 'user'
          }).then(() => {
            this.store.dispatch(new Logout());
          });
        } else if (previousRoute !== '/login') {
          this.router.navigateByUrl('home');
        }
      })
    ).subscribe(
      noop,
      error => console.log(error)
    );
  }

  loginUser(value) {
    this.authService.loginUser(value)
    .then((res: any) => {
      console.log(res);
      const user = res.user;
      this.errorMessage = '';
      this.store.dispatch(new Login({user}));
      this.router.navigateByUrl('/home');
    }, err => {
      this.errorMessage = err.message;
    });
  }

  goToRegisterPage() {
    this.router.navigateByUrl('/register');
  }

  trim($event) {
    const value = $event.target.value.trim();
    this.form.get('email').setValue(value);
  }

  togglePasswordInputType() {
    if (this.showPassword) {
      this.showPassword = false;
      this.passwordType = 'password';
    } else {
      this.showPassword = true;
      this.passwordType = 'text';
    }
  }

  ionViewWillLeave() {
    if (!_.isEmpty(this.loginSubscription)) {
      console.log('this.loginSubscription.unsubscribe()');
      this.loginSubscription.unsubscribe();
    }
  }

}
