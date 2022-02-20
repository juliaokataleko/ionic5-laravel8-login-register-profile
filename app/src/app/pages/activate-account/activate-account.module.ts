import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivateAccountPageRoutingModule } from './activate-account-routing.module';

import { ActivateAccountPage } from './activate-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivateAccountPageRoutingModule
  ],
  declarations: [ActivateAccountPage]
})
export class ActivateAccountPageModule {}
