import { TestBed } from '@angular/core/testing';

import { EventIntegrationService } from './event-integration.service';

describe('EventIntegrationService', () => {
  let service: EventIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
