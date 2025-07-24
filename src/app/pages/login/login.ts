import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
  IonItem,
  IonLabel,
  IonText, 
} from '@ionic/angular/standalone';

import { UserOptions } from '../../interfaces/user-options';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonInput,
    IonMenuButton,
    IonRow,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonText
  ],
})
export class LoginPage {
  // private router = inject(Router);
  // private user = inject(UserService);

  // login: UserOptions = { username: '', password: '' };
  // submitted = false;
  // mobile: string = '';

  // onLogin(form: NgForm) {
  //   this.submitted = true;

  //   if (form.valid) {
  //     this.user.login(this.login.username);
  //     this.router.navigateByUrl('/app/tabs/schedule');
  //   }
  // }

  // onSignup() {
  //   this.router.navigateByUrl('/signup');
  // }
  mobile: string = '';

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  async sendOtp(input?: string) {
    if(input) this.mobile = input;
    if (this.mobile.length !== 10) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter a valid 10-digit mobile number.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    // Simulate API call
    console.log(`Sending OTP to ${this.mobile}`);

    // Navigate to OTP page (pass mobile number)
    this.navCtrl.navigateForward(`/otp`, {
      state: { mobile: this.mobile }
    });
  }

    onMobileKeyup(event: KeyboardEvent) {
      const input = (event.target as HTMLInputElement).value;
      console.log('Key up:', input);

      // Example: auto-submit when 6 digits entered
      if (input.length === 10) {
        this.sendOtp(input);
      }
    }

}
