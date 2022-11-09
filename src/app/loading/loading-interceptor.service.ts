import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { LoadingCounterService } from './loading-counter.service';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {
  constructor(private loadingCounter: LoadingCounterService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingCounter.addLoad();
    return next.handle(req).pipe(
      catchError((err) => {
        this.loadingCounter.removeLoad();
        return of(err);
      }),
      finalize(() => {
        this.loadingCounter.removeLoad();
      })
    );
  }
}
