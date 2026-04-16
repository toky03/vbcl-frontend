import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { TasksOverviewComponent } from './tasks-overview/tasks-overview.component';
import { TasksCreateComponent } from './tasks-create/tasks-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingInterceptorService } from './loading/loading-interceptor.service';
import { EventsOverviewComponent } from './events-overview/events-overview.component';

function initializeKeycloak(keycloak: KeycloakService) {
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const silentCheckSsoRedirectUri = new URL(
    'assets/silent-check-sso.html',
    window.location.origin + baseHref
  ).toString();

  return () =>
    keycloak.init({
      config: {
        url: 'https://id.bubelu.ch',
        realm: 'VBCLyss',
        clientId: 'volley-app',
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri,
        silentCheckSsoFallback: false,
      },
    });
}

@NgModule({ declarations: [AppComponent, TasksOverviewComponent, TasksCreateComponent, EventsOverviewComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        CoreModule,
        NgbModule,
        KeycloakAngularModule,
        FormsModule,
        ReactiveFormsModule], providers: [
        provideAppInitializer(() => {
        const initializerFn = (initializeKeycloak)(inject(KeycloakService));
        return initializerFn();
      }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptorService,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
