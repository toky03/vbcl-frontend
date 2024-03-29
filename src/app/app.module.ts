import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { TasksOverviewComponent } from './tasks-overview/tasks-overview.component';
import { TasksCreateComponent } from './tasks-create/tasks-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingInterceptorService } from './loading/loading-interceptor.service';
import { EventsOverviewComponent } from './events-overview/events-overview.component';

function initializeKeycloak(keycloak: KeycloakService) {
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
        silentCheckSsoRedirectUri:
          window.location.href + '/assets/silent-check-sso.html',
      },
    });
}

@NgModule({
  declarations: [AppComponent, TasksOverviewComponent, TasksCreateComponent, EventsOverviewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    HttpClientModule,
    KeycloakAngularModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
