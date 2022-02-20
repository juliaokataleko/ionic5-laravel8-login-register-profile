import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.page.html',
  styleUrls: ['./activate-account.page.scss'],
})
export class ActivateAccountPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
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


}
