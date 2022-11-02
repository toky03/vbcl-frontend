import { TestBed } from '@angular/core/testing';

import { VbcCustomDateParserService } from './vbc-custom-date-parser.service';

describe('VbcCustomDateParserService', () => {
  let service: VbcCustomDateParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VbcCustomDateParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
