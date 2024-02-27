import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'alert-on-start',
  webDir: 'www',
  android: {
    webContentsDebuggingEnabled: false
  },
  ios: {
    webContentsDebuggingEnabled: false
  },
  server: {
    androidScheme: 'http',
    iosScheme: 'ionic'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
      useDialog: false
    }
  }
};

export default config;
