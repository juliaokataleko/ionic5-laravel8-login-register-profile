import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        
    }
    canActivate(): boolean | Observable<boolean> | Promise<boolean> {

        return this.authService.userIsLooged().then(data => {
            console.log("Data ", data);

            if (!data) {
                this.router.navigate(['/login']);
            }

            return data
        })
    }
}