import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import {
  defer,
  lastValueFrom,
  Observable,
  ObservableInput,
  switchMap,
  timer,
} from 'rxjs';
@Component({
  selector: 'app-root',
  template: `
    <ion-app *ngIf="isReady$ | async; else ngNotReady">
      <div>Hello world!</div>
      <ion-button (click)="onClick()">Click me</ion-button>
    </ion-app>
    <ng-template #ngNotReady>
      <div>
        <ion-spinner color="primary"></ion-spinner>
      </div>
    </ng-template>
  `,
  styles: [
    `
      div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  isReady$: Promise<boolean> | undefined;

  constructor(private alert: AlertController) {}

  ngOnInit(): void {
    this.isReady$ = Promise.resolve()
      .then(() => this.onReady())
      .then(() => this.onAlert())
      .catch((error) => this.onError(error))
      .then(() => true);
  }

  // This will fail, likely due to the DOM not being ready at the time of the alert
  // ngOnInit(): void {
  // this.isReady$ = Promise.resolve()
  // .then(() => this.onAlert())
  // .catch((error) => this.onError(error))
  // .then(() => this.onReady());
  // }

  onClick(): void {
    alert('do you always do as you are told?');
  }

  createAlert(options?: AlertOptions): Observable<HTMLIonAlertElement> {
    const defaults: AlertOptions = {
      backdropDismiss: false,
      buttons: ['Close'],
    };
    const onSubscribe = (): ObservableInput<HTMLIonAlertElement> => {
      return this.alert
        .create({ ...defaults, ...options })
        .then((modal) => modal.present().then(() => modal));
      //               ^^^^^^^^^^^^^^^ - deadlock occurs here
    };
    return defer(onSubscribe);
  }

  async onAlert(): Promise<void> {
    const options: AlertOptions = {
      header: 'Alert',
      message: 'This is an alert.',
    };
    await lastValueFrom(
      timer(1000).pipe(switchMap(this.createAlert.bind(this, options)))
    );
  }

  async onReady(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Light });
      await SplashScreen.hide({ fadeOutDuration: 500 });
    }
    return true;
  }

  onError(error: Error): void {
    console.error(error);
  }
}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   constructor() {}
// }
