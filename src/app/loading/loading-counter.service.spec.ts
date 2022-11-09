import { TestBed } from '@angular/core/testing';

import { LoadingCounterService } from './loading-counter.service';

describe('LoadingCounterService', () => {
  let service: LoadingCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
