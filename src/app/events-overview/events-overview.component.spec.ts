import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EventsOverviewComponent } from './events-overview.component';
import { AuthService } from '../core/auth.service';
import { EventIntegrationService } from '../event-integration.service';
import { IntegrationService } from '../integration.service';

describe('EventsOverviewComponent', () => {
  let component: EventsOverviewComponent;
  let fixture: ComponentFixture<EventsOverviewComponent>;
  let integrationService: jasmine.SpyObj<IntegrationService>;

  beforeEach(async () => {
    integrationService = jasmine.createSpyObj<IntegrationService>(
      'IntegrationService',
      ['readSortingOptions', 'updateIncludeOldEvents']
    );
    integrationService.readSortingOptions.and.returnValue(
      of({
        sortColumn: 'startDatum',
        sorting: 'ASC',
        includeOldEvents: false,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [EventsOverviewComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            roles: () => [],
          },
        },
        {
          provide: EventIntegrationService,
          useValue: {
            readEventNames: () => of([]),
          },
        },
        {
          provide: IntegrationService,
          useValue: integrationService,
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EventsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle old events inclusion', () => {
    component.toggleIncludeOldEvents();

    expect(component.includeOldEvents).toBeTrue();
    expect(integrationService.updateIncludeOldEvents).toHaveBeenCalledWith(true);
  });
});
