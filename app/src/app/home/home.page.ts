import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  appName: string = "Testiffy";

  limit: number = 10;
  start = 0;

  anggota: any
  private user: User;

  constructor(private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private storage: Storage,
  ) {
    this.user = new User();
  }

  async ngOnInit() {
    await this.storage.create();
  }

  ionViewWillEnter() {
    this.start = 0;
    this.storage.get('session_storage').then((data) => {
      console.log(data);      
      this.user = data
    })
  }

  async logout() {
    this.storage.clear();
    const toast = await this.toastCtrl.create({
      message: 'Sessão terminada',
      duration: 2000
    });
    toast.present();
    this.router.navigate(['/login'])
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }


}
