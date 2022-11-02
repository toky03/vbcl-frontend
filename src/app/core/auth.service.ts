import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  roles(): string[] {
    return this.keyCloakService.getUserRoles();
  }
  constructor(private keyCloakService: KeycloakService) {}

  get userName(): Observable<string | undefined> {
    return from(this.keyCloakService.loadUserProfile()).pipe(
      map((profile) => {
        return profile.username;
      })
    );
  }

  get givenName(): Observable<string | undefined> {
    return from(this.keyCloakService.loadUserProfile()).pipe(
      map((profile) => {
        return profile.firstName;
      })
    );
  }

  logout() {
    this.keyCloakService.logout();
  }

  isAuthenticated(): Observable<boolean> {
    return of(false);
  }
}
