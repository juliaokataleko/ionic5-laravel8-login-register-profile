import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = "";
  password: string = "";
  confirm_password: string = "";
  phone: string = "";

  phoneExistsError: string = "";
  usernameExistsError: string = "";
  canRegister: boolean = false;

  constructor(private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  formLogin() {
    this.router.navigate(['/login']);
  }

  async registerUser() {
    if (this.username == "" || this.password == "") {
      const toast = await this.toastController.create({
        message: 'Preencha todos os campos correctamente.',
        duration: 2000
      });
      toast.present();
    } else if (this.password != this.confirm_password) {
      const toast = await this.toastController.create({
        message: 'Confirme sua Palavra-passe por favor.',
        duration: 2000
      });
    } else {
      let body = {
        action: 'register',
        username: this.username,
        phone: this.phone,
        password: this.password
      };
      this.authService.postData(body, 'api/register').subscribe(async (data: any) => {
        let alertmsg = data.msg;

        console.log("Dados", data.original);
        data = data.original;

        if (data.success) {
          this.storage.set('session_storage', data.result[0]); // create storage

          this.router.navigate(['/']);

          const toast = await this.toastController.create({
            message: 'Parabéns!!! Sua conta foi criada com sucesso.',
            duration: 2000
          });
          toast.present();

        } else {
          const toast = await this.toastController.create({
            message: alertmsg,
            duration: 2000
          });
          toast.present();
        }

        // if (data.success) {
        //   this.router.navigate(['/login']);
        //   const toast = await this.toastController.create({
        //     message: 'Parabéns!!! Sua conta foi criada com sucesso.',
        //     duration: 2000
        //   });
        //   toast.present();
        // } else {
        //   const toast = await this.toastController.create({
        //     message: alertmsg,
        //     duration: 2000
        //   });
        //   toast.present();
        // }

      });

    } // if everything is correct end here...
  }

  async checkUsername() {

    let body = {
      username: this.username,
    };
    this.authService.postData(body, 'api/checkusername').subscribe(async (data: any) => {

      data = data.original;
      this.usernameExistsError = data.msg;

    });
  }

  async checkPhone() {

    let body = {
      phone: this.phone,
    };
    this.authService.postData(body, 'api/checkphone').subscribe(async (data: any) => {

      data = data.original;
      this.phoneExistsError = data.msg;

    });
  }

}
