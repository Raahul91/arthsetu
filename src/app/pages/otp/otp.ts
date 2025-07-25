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
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever/ngx';


@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
  styleUrls: ['./otp.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel, 
    IonText
  ],
})
export class OtpPage {
  mobile: string = '';
  otp: string = '';

  constructor(private router: Router, private toastCtrl: ToastController, private smsRetriever: SmsRetriever, private navCtrl: NavController, ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.mobile) {
      this.mobile = nav.extras.state.mobile;
    }
  }

  startListeningForOtp() {
    this.smsRetriever.startWatching()
      .then(() => {
        document.addEventListener('onSmsArrive', (event: any) => {
          const message = event['message'];
          console.log('Received SMS:', message);

          // Example: "Your OTP code is 123456"
          const code = message.match(/\d{6}/)[0];
          this.otp = code;
        });
      })
      .catch((error) => {
        console.error('SMS Retriever error:', error);
      });
  }

  ngOnInit() {
    this.startListeningForOtp();
  }

  onOtpKeyup(event: KeyboardEvent) {
  const input = (event.target as HTMLInputElement).value;
  console.log('Key up:', input);

  // Example: auto-submit when 6 digits entered
  if (input.length === 6) {
    this.verifyOtp(input);
  }
}


  async verifyOtp(input?: string) {
    if(input) {
      this.otp = input;
    }
    console.log('Verifying OTP:', this.otp);
    if (this.otp.toString() === '123456') {
      // Simulate OTP success
      const toast = await this.toastCtrl.create({
        message: 'Login successful!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      // Redirect or navigate to home
    //   this.navCtrl.navigateForward(`/app`, {
    //   state: { mobile: this.mobile }
    // });
    this.router.navigate(['/app']);
    
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Invalid OTP.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }


}
