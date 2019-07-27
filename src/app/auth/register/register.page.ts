import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Login } from 'src/app/auth/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;
  errorMessage: string;
  successMessage: string;
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
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translator: TranslateService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
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

  tryRegister(value) {
    this.authService.registerUser(value)
     .then((res: any) => {
       console.log(res);
       const user = res.user;
       this.errorMessage = '';
       this.successMessage = this.translator.instant('Your account has been created. Please log in.');
       this.store.dispatch(new Login({user}));
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';
     });
  }

  goLoginPage() {
    this.navCtrl.navigateBack('login');
  }

}
