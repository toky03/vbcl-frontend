import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: KeycloakService,
          useValue: {
            login: () => {},
            logout: () => {},
            getUserRoles: () => [],
            isLoggedIn: () => false,
            loadUserProfile: () => Promise.resolve({}),
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
