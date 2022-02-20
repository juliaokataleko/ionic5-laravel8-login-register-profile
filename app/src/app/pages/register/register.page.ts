import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
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

  errors: any[];

  constructor(private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: Storage,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  formLogin() {
    this.router.navigate(['/login']);
  }

  async registerUser() {
    console.log("Yoooooooooooo");
    
    if (this.username == "" || this.password == "" 
    || this.usernameExistsError != "" || this.phoneExistsError != "") {
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
      toast.present();
    } else {

      let body = {
        action: 'register',
        username: this.username,
        phone: this.phone,
        password: this.password
      };

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Carregando...',
      });

      await loading.present();

      this.authService.register(body).then(async (res: any) => {
      
        await loading.dismiss();

        let data = res.data.original;
        let alertmsg = data.msg

        if (data.success) {
          this.storage.set('session_storage', data.result[0]); // create storage

          window.location.href = "/"

          // reset data
          this.username = "";
          this.phone = "";
          this.password = "";

          const toast = await this.toastController.create({
            message: 'Parabéns!!! Sua conta foi criada com sucesso.',
            duration: 2000
          });
          toast.present();

        } else {


          var keys = Object.keys(data.errors);

          this.errors = [];
          keys.forEach(key => {
            console.log(data.errors[key]);
            this.errors.push({ msg: data.errors[key][0]})
          });

        }

      });

    } 
  }

  async checkUsername() {

    let body = {
      username: this.username,
    };
    this.authService.checkusername(body).then(async (res: any) => {

      let data = res.data.original;
      this.usernameExistsError = data.msg;

    });
  }

  async checkPhone() {

    let body = {
      phone: this.phone,
    };
    this.authService.checkphone(body).then(async (res: any) => {

      let data = res.data.original;
      this.phoneExistsError = data.msg;

    });
  }

}
