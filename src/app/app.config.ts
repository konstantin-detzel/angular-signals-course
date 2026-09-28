import {ApplicationConfig, inject} from '@angular/core';
import {provideRouter, Router, withComponentInputBinding, withNavigationErrorHandler} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {loadingInterceptor} from "./services/loading.interceptor";
import {MessagesService} from "./messages/messages.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(),
      withNavigationErrorHandler((error) => {
        console.error(error);
        inject(MessagesService).showMessage('Something went wrong loading this page', 'error');
        inject(Router).navigate(['/']);
      })),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor
      ])
    )
  ]
};
