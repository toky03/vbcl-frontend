import { TestBed } from '@angular/core/testing';

import { LoadingInterceptorService } from './loading-interceptor.service';
import { LoadingCounterService } from './loading-counter.service';

describe('LoadingInterceptorService', () => {
  let service: LoadingInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingInterceptorService,
        {
          provide: LoadingCounterService,
          useValue: {
            addLoad: () => {},
            removeLoad: () => {},
          },
        },
      ],
    });
    service = TestBed.inject(LoadingInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
