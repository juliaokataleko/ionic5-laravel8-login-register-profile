import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ActiveGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        
    }
    canActivate(): boolean | Observable<boolean> | Promise<boolean> {

        return this.authService.userLoogedActiveted().then(data => {
            console.log("Is active ", data);
            
            if (!data) {
                this.router.navigate(['/activate-account']);
            }

            return data
        })

        
    }
}