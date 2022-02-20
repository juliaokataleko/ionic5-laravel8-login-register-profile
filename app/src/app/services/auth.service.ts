import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
// import 'rxjs/Rx';

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

  server = "http://127.0.0.1:8000/"

  constructor(public http: HttpClient) {
  }

  postData(body, file) {
    return this.http.post(this.server + file, JSON.stringify(body),
      httpOptions);
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
}

