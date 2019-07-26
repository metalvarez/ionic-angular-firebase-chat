import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { reducers, metaReducers } from './reducers';
import { CustomSerializer } from './shared/utils';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginPageModule } from './auth/login/login.module';

import * as firebase from 'firebase';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireAuthModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    LoginPageModule.forRoot(),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'})
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

