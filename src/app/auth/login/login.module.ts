import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import * as fromAuth from 'src/app/auth/auth.reducer';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from '../auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule.forChild(),
    StoreModule.forFeature('auth', fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [LoginPage],
  exports: [LoginPage]
})
export class LoginPageModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: LoginPageModule,
        providers: [
          AuthService,
          AuthGuard
        ]
    };
  }
}
