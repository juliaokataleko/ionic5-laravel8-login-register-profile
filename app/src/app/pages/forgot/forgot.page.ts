import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  usernameOrPhone: string = "";
  code: string = "";
  npassword: string = "";

  codeSent: boolean = false;
  timesSent: number = 0;

  errors: any[];

  phone: string = "";
  country_phone_code: string = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit(

  ) {
  }

  async recover() {
    let data = {
      usename: this.country_phone_code + '' + this.phone,
    }

    

    if (this.country_phone_code != '' && this.phone != '') {

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Carregando...',
      });

      await loading.present();
      
      this.authService.recover(data).then(async (data) => {
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

          // 
          this.codeSent = true;

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
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Atenção!',
        message: 'Por favor selecione o código do país',
        buttons: ['OK']
      });

      await alert.present();
    }

  }

  async resetPassword() {
    let data = {
      usename: this.country_phone_code + '' + this.phone,
      code: this.code,
      password: this.npassword
    }

  
    if (this.country_phone_code != '' && this.phone != '') {

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Carregando...',
      });

      await loading.present();

      this.authService.reset(data).then(async (data) => {
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

          this.storage.clear();
          this.storage.set('session_storage', data.result[0]); // create storage
          // this.router.navigate(['/']);
          // reste data
          this.usernameOrPhone = "";
          this.npassword = "";
          this.code = "";

          this.router.navigate(['/home']);

        } else {

          var keys = Object.keys(data.errors);

          this.errors = [];
          keys.forEach(key => {
            console.log(data.errors[key]);
            this.errors.push({ msg: data.errors[key][0] })
          });

          // const alert = await this.alertCtrl.create({
          //   cssClass: 'my-custom-class',
          //   header: 'Atencão!',
          //   message: data.msg,
          //   buttons: ['OK']
          // });

          // await alert.present();

        }
      });

    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Atenção!',
        message: 'Por favor selecione o código do país',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  resetData() {
    this.usernameOrPhone = "";
    this.code = "";
    this.codeSent = false;
  }

}
