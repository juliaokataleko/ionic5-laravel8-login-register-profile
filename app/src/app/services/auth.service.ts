import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
import { RouteEntry } from '@ionic/core';
import { Router } from '@angular/router';
// import 'rxjs/Rx';
import { Storage } from '@ionic/storage-angular';
import { User } from '../models/User';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'enctype': 'multipart/formdata',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  server = environment.apiUrl;

  public isUserLoggedIn: boolean = false;
  public userLoogedActive: boolean = false;

  constructor(
    private storage: Storage,
    private router: Router
  ) {
    this.storage.get('session_storage').then((res) => {

      // this.storage.clear();
      console.log("Usuário: ", res);

      if (res == null) {
        this.userLoogedActive = false
        this.isUserLoggedIn = false;
      } else {        
        
        this.isUserLoggedIn = true;
        this.userLoogedActive = (res.active == 1) ? true : false;
      }
    });
  }

  // postData(body, file) {
  //   return this.http.post(this.server + file, JSON.stringify(body),
  //     httpOptions);
  // }

  register(data): Promise<any> {

    let route = this.server + 'api/register'
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  login(data): Promise<any> {
    let route = this.server + 'api/login';
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  updateProfile(data): Promise<any> {
    
    let route = this.server + 'api/update-user'
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  updateAvatar(data): Promise<any> {
    let route = this.server + "api/update-avatar"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        
      });
  }

  // check if username exists
  checkusername(data): Promise<any> {
    let route = this.server + 'api/checkusername'
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  // check if phone exists
  checkphone(data): Promise<any> {
    let route = this.server + 'api/checkphone'
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  updatePassword(data): Promise<any> {
    let route = this.server + "api/update-password"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  deleteAccount(data): Promise<any> {
    let route = this.server + "api/delete-account"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  userLoogedActiveted(): Promise<any> {
    return this.storage.get('session_storage').then((res) => {

      if (res != null && res.active == 1) return true;
      return false;
    })
  }

  userIsLooged(): Promise<any> {
    return this.storage.get('session_storage').then((res) => {

      if (res == null) return false;
      return true;
    })
  }
  
  // activate the account
  activateAccount(data): Promise<any> {
    let route = this.server + "api/activate"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  // recover account 
  recover(data): Promise<any> {
    let route = this.server + "api/account-recover"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }
  // reset password
  reset(data): Promise<any> {
    let route = this.server + "api/account-reset"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }

  // resend code
  resendCode(data): Promise<any> {
    let route = this.server + "api/resend-code"
    return axios
      .post(route, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {

      });
  }
}

