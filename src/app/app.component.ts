import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const { SplashScreen, StatusBar } = Plugins;
    try {
      await SplashScreen.hide();
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
      if (this.platform.is('android')) {
        StatusBar.setBackgroundColor({ color: '#3171e0' });
      }
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }
}
