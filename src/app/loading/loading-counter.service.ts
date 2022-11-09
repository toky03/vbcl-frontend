import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingCounterService {
  private loadingCounter$: BehaviorSubject<number> = new BehaviorSubject(0);

  addLoad(): void {
    this.loadingCounter$.next(this.loadingCounter$.value + 1);
  }

  removeLoad(): void {
    this.loadingCounter$.next(this.loadingCounter$.value - 1);
  }
  isLoading(): Observable<boolean> {
    return this.loadingCounter$.pipe(map((count) => count > 0));
  }
}
