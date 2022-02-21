import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.page.html',
  styleUrls: ['./activate-account.page.scss'],
})
export class ActivateAccountPage implements OnInit {

  confirmation_code: string = "";
  user: User = new User();

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

  ionViewWillEnter() {
    this.storage.get('session_storage').then((data) => {
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

  async tryToActivateAccount(fromBtn = false) {

    if (this.confirmation_code.length == 4) {

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Carregando...',
      });

      await loading.present();

      let data = {
        uuid: this.user.uuid,
        confirmation_code: this.confirmation_code
      }

      this.authService.activateAccount(data).then(async (res) => {
        
        let data = res.data.original;

        console.log(data);        

        await loading.dismiss();

        if (data.success) {
          const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Perfeito!!',
            message: data.msg,
            buttons: ['OK']
          });

          await alert.present();

          this.storage.clear();
          this.storage.set('session_storage', data.result[0]); // create storage
          
          this.router.navigate(['/home']);

        } else {

          const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Atenção!!',
            message: data.msg,
            buttons: ['OK']
          });

          await alert.present();
        }
        
      })
    } else if (fromBtn) {

      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Atenção!!',
        message: "O código deve ter 4 carateres",
        buttons: ['OK']
      });

      await alert.present();
    }
    

  }

  async resendCCode() {
    let data = {
      phone: this.user.phone
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Carregando...',
    });

    await loading.present();

    this.authService.resendCode(data).then(async (data) => {
      data = data.data.original;

      await loading.dismiss();

      console.log("Dados...", data);

      if (data.success) {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Perfeito!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();

      } else {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Atenção!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();

      }
    });
  }

}
