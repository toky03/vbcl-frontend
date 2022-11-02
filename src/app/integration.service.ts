import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AmtPosten, ReadOptions } from './core/model';

const BASE_URL = 'https://volley.bubelu.ch/api';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  private initialReadOptions: ReadOptions = {
    sortColumn: 'datum',
    sorting: 'ASC',
  };
  private triggerReadSubject$: Subject<string> = new BehaviorSubject('');
  private readOptions$: BehaviorSubject<ReadOptions> = new BehaviorSubject(
    this.initialReadOptions
  );
  private tasksRead$: Observable<AmtPosten[]>;

  constructor(private httpClient: HttpClient) {
    this.tasksRead$ = combineLatest([
      this.triggerReadSubject$,
      this.readOptions$,
    ]).pipe(
      switchMap(([x, readOptions]: [string, ReadOptions]) =>
        this.httpClient.get<AmtPosten[]>(BASE_URL + '/tasks', {
          params: { ...readOptions },
        })
      )
    );
  }

  private executeRead(): void {
    this.triggerReadSubject$.next('');
  }

  updateSorting(readOptions: ReadOptions): void {
    this.readOptions$.next(readOptions);
  }

  readSortingOptions(): Observable<ReadOptions> {
    return this.readOptions$.asObservable();
  }

  saveTask(aufgabe: AmtPosten): Observable<void> {
    return this.httpClient
      .post<void>(BASE_URL + '/tasks', aufgabe)
      .pipe(tap(() => this.executeRead()));
  }

  readTasks(): Observable<AmtPosten[]> {
    return this.tasksRead$;
  }

  reservate(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/reservate`, {})
      .pipe(tap(() => this.executeRead()));
  }

  revokeReservation(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/revoke-reservation`, {})
      .pipe(tap(() => this.executeRead()));
  }

  confirm(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/confirm`, {})
      .pipe(tap(() => this.executeRead()));
  }

  revokeConfirm(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/revoke-confirm`, {})
      .pipe(tap(() => this.executeRead()));
  }

  delete(taskId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${BASE_URL}/tasks/${taskId}`, {})
      .pipe(tap(() => this.executeRead()));
  }
  edit(taskId: string, task: AmtPosten): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}`, task)
      .pipe(tap(() => this.executeRead()));
  }

  downloadCsv(): Observable<ArrayBuffer> {
    const readOptions = this.readOptions$.value;
    return this.httpClient.get(BASE_URL + '/export', {
      params: { ...readOptions },
      responseType: 'arraybuffer',
    });
  }
}
