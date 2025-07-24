// import { DOCUMENT } from '@angular/common';
// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   OnDestroy,
//   ViewChild,
//   inject,
// } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
// import { LocationService } from '../../providers/location.service';
// import { Location } from '../../interfaces/conference.interfaces';
// import * as L from 'leaflet';
// import { Subscription, firstValueFrom } from 'rxjs';

// @Component({
//   selector: 'page-map',
//   template: `
//     <ion-header>
//       <ion-toolbar>
//         <ion-buttons slot="start">
//           <ion-menu-button></ion-menu-button>
//         </ion-buttons>
//         <ion-title>Map</ion-title>
//       </ion-toolbar>
//     </ion-header>

//     <ion-content>
//       <div #mapCanvas class="map-canvas"></div>
//     </ion-content>
//   `,
//   styleUrls: ['./map.scss'],
//   imports: [
//     IonHeader,
//     IonToolbar,
//     IonButtons,
//     IonMenuButton,
//     IonTitle,
//     IonContent,
//   ],
//   standalone: true,
// })
// export class MapPage implements AfterViewInit, OnDestroy {
//   private doc = inject(DOCUMENT);
//   private locationService = inject(LocationService);
//   private map: L.Map | null = null;
//   private markers: L.Marker[] = [];
//   private subscription: Subscription;

//   @ViewChild('mapCanvas', { static: true }) mapElement!: ElementRef;

//   ngAfterViewInit() {
//     this.locationService.loadLocations().subscribe(() => {
//       this.initializeMap();
//     });

//     // Subscribe to location changes
//     this.subscription = this.locationService.getLocations().subscribe(() => {
//       if (this.map) {
//         this.initializeMap();
//       }
//     });
//   }

//   ngOnDestroy() {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//     if (this.map) {
//       this.map.remove();
//     }
//   }

//   private async initializeMap() {
//     const mapEle = this.mapElement.nativeElement;

//     // Remove existing map if it exists
//     if (this.map) {
//       this.map.remove();
//       this.markers.forEach(marker => marker.remove());
//       this.markers = [];
//     }

//     try {
//       // Get center location
//       const centerLocation = await firstValueFrom(this.locationService.getCenterLocation());
//       if (!centerLocation) {
//         return;
//       }

//       // Initialize map
//       this.map = L.map(mapEle, {
//         center: [centerLocation.lat, centerLocation.lng],
//         zoom: 16,
//         preferCanvas: true
//       });

//       // Configure default marker icon with shadow
//       L.Marker.prototype.options.icon = L.icon({
//         iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34],
//         shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//         shadowSize: [41, 41],
//         shadowAnchor: [12, 41]
//       });

//       // Add tile layer
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(this.map);

//       // Add markers for all locations
//       const locations = await firstValueFrom(this.locationService.getLocations());
//       if (this.map && locations) {
//         locations.forEach((location: Location) => {
//           const marker = L.marker([location.lat, location.lng])
//             .addTo(this.map as L.Map)
//             .bindPopup(`${location.name}`, {
//               className: 'location-popup'
//             });
//           this.markers.push(marker);
//         });
//       }

//       mapEle.classList.add('show-map');

//       // Force a resize after a short delay to ensure proper rendering
//       setTimeout(() => {
//         this.map?.invalidateSize();
//       }, 100);
//     } catch (error) {
//       console.error('Error initializing map:', error);
//     }
//   }
// }

// import { Component, signal, inject } from '@angular/core';
// import { NgIf } from '@angular/common';
// import { isPlatformBrowser } from '@angular/common';
// import { PLATFORM_ID } from '@angular/core';

// // Type aliases for browser compatibility
// type _SpeechRecognition = typeof window extends { webkitSpeechRecognition: infer T } ? T : any;
// type _SpeechRecognitionEvent = typeof window extends { webkitSpeechRecognitionEvent: infer T } ? T : any;

// @Component({
//   selector: 'app-root',
//   // imports: [NgIf],
//   templateUrl: './map.html',
//   styleUrl: './map.css'
// })
// export class MapPage {
//   protected readonly title = signal('speech-to-text-app');

//   recognizedText = signal('');
//   isListening = signal(false);
//   recognition: any = null;

//   constructor() {
//     const platformId = inject(PLATFORM_ID);
//     if (isPlatformBrowser(platformId)) {
//       if ('webkitSpeechRecognition' in window) {
//         this.recognition = new (window as any).webkitSpeechRecognition();
//       } else if ('SpeechRecognition' in window) {
//         this.recognition = new (window as any).SpeechRecognition();
//       }
//       if (this.recognition) {
//         this.recognition.continuous = false;
//         this.recognition.interimResults = false;
//         this.recognition.lang = 'en-US';
//         this.recognition.onresult = (event: any) => {
//           const transcript = event.results[0][0].transcript;
//           this.recognizedText.set(transcript);
//           this.isListening.set(false);
//         };
//         this.recognition.onend = () => {
//           this.isListening.set(false);
//         };
//         this.recognition.onerror = () => {
//           this.isListening.set(false);
//         };
//       }
//     }
//   }

//   startListening() {
//     if (this.recognition && !this.isListening()) {
//       this.recognizedText.set('');
//       this.isListening.set(true);
//       this.recognition.start();
//     }
//   }

//   stopListening() {
//     if (this.recognition && this.isListening()) {
//       this.recognition.stop();
//       this.isListening.set(false);
//     }
//   }
// }


import { Component, NgZone } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { CommonModule } from '@angular/common';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'map.html',
  styleUrls: ['map.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonCardContent,
    IonCard,
    CommonModule
  ],
  standalone: true,
})
export class MapPage {
  recognizedText: string = '';
   isListening: boolean = false;
  matches: any; //Array<String>;
  constructor(private speech: SpeechRecognition, private zone: NgZone, private textToSpeech: TextToSpeech) {}

  // async startListening() {
  //   await this.speechRecognition.requestPermission();
  //   this.speechRecognition.startListening()
  //     .subscribe(
  //       (matches: string[]) => {
  //         this.recognizedText = matches[0];
  //         console.log(matches);
  //       },
  //       (error) => console.error(error)
  //     );
  // }

  // stopListening() {
  //   this.speechRecognition.stopListening();
  // }

   async hasPermission():Promise<boolean> {
    try {
      const permission = await this.speech.hasPermission();
      console.log(permission);
      return permission;
    } catch(e) {
      console.log(e);
    }
  }

  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {
      console.log(e);
    }
  }

  async listen() {
    console.log('listen action triggered');
    // if (this.isListening) {
    //   this.speech.stopListening();
    //   this.toggleListenMode();
    //   return;
    // }

    // this.toggleListenMode();
    let _this = this;

    // this.speech.startListening()
    //   .subscribe(matches => {
    //     _this.zone.run(() => {
    //       _this.matches = matches;
    //     })
    //   }, (error) => console.error(error));


       await this.speech.requestPermission();
        this.speech.startListening()
          .subscribe(
            (matches) => {
              _this.zone.run(() => {
              _this.matches = matches;
            })
              console.log(matches);
            },
            (error) => console.error(error)
          );

  }

  toggleListenMode():void {
    this.isListening = this.isListening ? false : true;
    console.log('listening mode is now : ' + this.isListening);
  }

  async convertTextToSpeech(text: string) {
    try {
      await this.textToSpeech.speak({
        text: text,
        locale: 'mr-IN', //'en-US', // Optional: specify a locale
        rate: 1.0 // Optional: speech rate (e.g., 0.5 to 2.0)
      });
      console.log('Text spoken successfully');
    } catch (e) {
      console.error('Error speaking text:', e);
    }
  }
}