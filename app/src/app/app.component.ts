import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private storage: Storage,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();

    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
    });

    // let session = localStorage.getItem('session_storage');
    // if (session == null) {
    //   this.router.navigate(['/login'])
    // } else {
    //   // this.router.navigate(['/customers'])
    // }

    this.storage.get('session_storage').then((res) => {
      if (res == null) {
        this.router.navigate(['/login'])
      } else {
        // this.router.navigate(['/customers'])
      }
    });
  }
}
