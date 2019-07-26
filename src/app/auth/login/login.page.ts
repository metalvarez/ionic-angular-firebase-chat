import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  errorMessage: string;
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
    private translator: TranslateService
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

  loginUser(value) {
    this.authService.loginUser(value)
    .then(res => {
      console.log(res);
      this.errorMessage = '';
      this.navCtrl.navigateForward('/home');
    }, err => {
      this.errorMessage = err.message;
    });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

}
