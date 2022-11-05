import { TestBed } from '@angular/core/testing';

import { VbcTimeAdapterService } from './vbc-time-adapter.service';

describe('VbcTimeAdapterService', () => {
  let service: VbcTimeAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VbcTimeAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
