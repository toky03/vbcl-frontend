import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login() {
    this.keyCloakService.login();
  }

  roles(): string[] {
    return this.keyCloakService.getUserRoles();
  }
  constructor(private keyCloakService: KeycloakService) {}

  get userName(): Observable<string | undefined> {
    return this.loadUserProfile().pipe(
      map((profile) => {
        return profile.email;
      })
    );
  }

  get givenName(): Observable<string | undefined> {
    return this.loadUserProfile().pipe(
      map((profile) => {
        return profile.firstName;
      })
    );
  }

  logout() {
    this.keyCloakService.logout();
  }

  isAuthenticated(): Observable<boolean> {
    return from(this.keyCloakService.isLoggedIn());
  }

  private loadUserProfile(): Observable<KeycloakProfile> {
    return this.isAuthenticated().pipe(
      switchMap((authenticated: boolean) => {
        if (authenticated) {
          return from(this.keyCloakService.loadUserProfile());
        }
        return of({});
      })
    );
  }
}
