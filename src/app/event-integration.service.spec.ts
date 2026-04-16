import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EventIntegrationService } from './event-integration.service';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;

describe('EventIntegrationService', () => {
  let service: EventIntegrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EventIntegrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request event names without old events by default', () => {
    service.readEventNames().subscribe();

    const req = httpTestingController.expectOne(
      `${BASE_URL}/tasks/events?includeOldEvents=false`
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should request event names with old events when enabled', () => {
    service.readEventNames(true).subscribe();

    const req = httpTestingController.expectOne(
      `${BASE_URL}/tasks/events?includeOldEvents=true`
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
