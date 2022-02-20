import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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

  constructor(private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController
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
  onInputFileChange(event) {
    this.file = event.target.files[0];
    console.log(this.file);

    // Create form data
    let formData: FormData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", this.file);
    formData.append("id", String(this.user.id));

    this.authService.updateAvatar(formData).then(async (res: any) => {
      let data = res.data.original; 
      
      console.log("dados: ", data);

      if (data.success) {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Foto Atualizada!!',
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
    
    this.authService.postData(this.user, 'api/update-user').subscribe(async (data: any) => {
      data = data.original;

      if (data.success) {

        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Boas!! ' + data.result[0].name,
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
}
