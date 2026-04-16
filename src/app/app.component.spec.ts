import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';
import { IntegrationService } from './integration.service';
import { LoadingCounterService } from './loading/loading-counter.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: () => of(false),
            givenName: of(undefined),
            userName: of(undefined),
            roles: () => [],
            login: () => {},
            logout: () => {},
          },
        },
        {
          provide: IntegrationService,
          useValue: {
            downloadCsv: () => of(''),
          },
        },
        {
          provide: LoadingCounterService,
          useValue: {
            isLoading: () => of(false),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
