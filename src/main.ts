import '@angular/compiler';

import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import {
  provideServiceWorker,
  ServiceWorkerModule,
} from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {TextToSpeech } from '@ionic-native/text-to-speech/ngx'; 
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever/ngx';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),
    provideHttpClient(),
    importProvidersFrom(
      IonicStorageModule.forRoot(),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
      })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    SpeechRecognition,
    TextToSpeech,
    SmsRetriever
  ],
}).catch(err => console.error(err));
