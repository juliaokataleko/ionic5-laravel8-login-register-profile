import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  limit: number = 10;
  start = 0;

  private user: User;
  private file: string = '';

  password: string = '';
  npassword: string = '';
  cpassword: string = '';

  constructor(private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {
    this.user = new User();
  }

  async ngOnInit() {
    await this.storage.create();
  }

  ionViewWillEnter() {
    this.start = 0;
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

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  // On file Select
  async onInputFileChange(event) {
    this.file = event.target.files[0];
    console.log(this.file);

    // Create form data
    let formData: FormData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", this.file);
    formData.append("id", String(this.user.id));

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Carregando...',
    });
    
    
    await loading.present();

    this.authService.updateAvatar(formData).then(async (res: any) => {
      let data = res.data.original; 

      await loading.dismiss();
      
      if (data.success) {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Perfeito!!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();

        // const { role } = await alert.onDidDismiss();
        // console.log('onDidDismiss resolved with role', role);

        this.storage.clear();
        this.storage.set('session_storage', data.result[0]); // create storage
        this.router.navigate(['/home'])

      }
    })
  }

  // update user
  async updateUser() {
    
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Carregando...',
    });

    await loading.present();

    this.authService.updateProfile(this.user).then(async (data: any) => {
      data = data.data.original;
      
      await loading.dismiss();

      if (data.success) {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Perfeito!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();

        // const { role } = await alert.onDidDismiss();
        // console.log('onDidDismiss resolved with role', role);


        this.storage.clear();
        this.storage.set('session_storage', data.result[0]); // create storage
        this.router.navigate(['/home'])

      } else {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Atenção!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();

      }
    })
  }

  async updatePassword() {

    let data = {
      password: this.password,
      npassword: this.npassword,
      cpassword: this.cpassword,
      userid: this.user.id,
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Carregando...',
    });

    await loading.present();

    this.authService.updatePassword(data).then(async (res: any) => {
      let data = res.data.original;

      console.log(data);
      
      await loading.dismiss();

      if (data.success) {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Pefeito!!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();

        // reset change password fields
        this.password = "";
        this.npassword = "";
        this.cpassword = "";
      } else {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Opps!!',
          message: data.msg,
          buttons: ['OK']
        });

        await alert.present();
      }
    })
  }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Atenção!',
      message: "Tens a certeza que queres apagar sua conta?",
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim, confirmo',
          id: 'confirm-button',
          handler: async () => {

            const loading = await this.loadingController.create({
              cssClass: 'my-custom-class',
              message: 'Carregando...',
            });

            await loading.present();

            this.authService.deleteAccount(this.user).then( async (data) => {
              
              data = data.data.original;

              await loading.dismiss();

              if (data.success) { 
                this.storage.clear();
                this.router.navigate(['/login'])
              } else {
                const toast = await this.toastCtrl.create({
                  message: 'Ocorreu um erro.',
                  duration: 2000
                });
                toast.present();
              }             
              
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
