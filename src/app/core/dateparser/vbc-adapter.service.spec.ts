import { TestBed } from '@angular/core/testing';

import { VbcAdapterService } from './vbc-adapter.service';

describe('VbcAdapterService', () => {
  let service: VbcAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VbcAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
