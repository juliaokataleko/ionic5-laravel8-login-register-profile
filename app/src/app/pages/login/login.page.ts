import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage,
    private loadingController: LoadingController
  ) {
    
  }

  async ngOnInit() {
    await this.storage.create();
    this.storage.clear();
  }

  formRegister() {
    this.router.navigate(['/register']);
  }

  async login() {
    if (this.username != "" || this.password != "") {
      let body = {
        username: this.username,
        password: this.password
      };

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Carregando...',
      });

      await loading.present();

      this.authService.login(body).then(async (res: any) => {

        await loading.dismiss();

        let data = res.data.original;

        let alertmsg = data.msg;

        if (data.success) {
          this.storage.set('session_storage', data.result[0]); // create storage
          // this.router.navigate(['/']);
          // reste data
          this.username = "";
          this.password = "";

          this.router.navigate(['/home']);
        } else {
          const toast = await this.toastController.create({
            message: alertmsg,
            duration: 2000
          });
          toast.present();
        }

      });
    } else {
      const toast = await this.toastController.create({
        message: 'Preencha todos os campos correctamente.',
        duration: 2000
      });
      toast.present();

    } // if everything is correct end here...
  }

}

