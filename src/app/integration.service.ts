import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AmtPosten, ReadOptions } from './core/model';
import { environment } from 'src/environments/environment';
import { ToastService } from './core/toast/toast.service';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  private initialReadOptions: ReadOptions = {
    sortColumn: 'startDatum',
    sorting: 'ASC',
  };
  private loadingSubject$: Subject<boolean> = new BehaviorSubject(false);
  private triggerReadSubject$: Subject<string> = new BehaviorSubject('');
  private readOptions$: BehaviorSubject<ReadOptions> = new BehaviorSubject(
    this.initialReadOptions
  );
  private tasksRead$: Observable<AmtPosten[]>;

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService
  ) {
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
    return this.httpClient.post<void>(BASE_URL + '/tasks', aufgabe).pipe(
      tap(() => {
        this.toastService.show(
          'Der Helfereinsatz konnte erfolgreich erstellt werden',
          { classname: 'success', delay: 5000 }
        );
        this.executeRead();
      }),
      catchError((error) =>
        of(
          this.toastService.show('Helfereinsatz konnte nicht erstellt werden', {
            classname: 'danger',
          })
        )
      )
    );
  }

  readTasks(): Observable<AmtPosten[]> {
    return this.tasksRead$;
  }

  reservate(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/reservate`, {})
      .pipe(
        tap(() => {
          this.toastService.show(
            'Der Helfereinsatz wurde f??r dich reserviert. Sobald dieser vom TK Admin best??tigt wurde erh??lst du eine E-Mail',
            { classname: 'success', delay: 5000 }
          );
          this.executeRead();
        }),
        catchError((error) =>
          of(
            this.toastService.show(
              'Helfereinsatz konnte nicht reserviert werden',
              { classname: 'danger' }
            )
          )
        )
      );
  }

  revokeReservation(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/revoke-reservation`, {})
      .pipe(
        tap(() => {
          this.toastService.show(
            'Die Reservierung konnte erfolgreich entfernt werden',
            { classname: 'success', delay: 5000 }
          );
          this.executeRead();
        }),
        catchError((error) =>
          of(
            this.toastService.show(
              'Die Reservierung konnte nicht entfernt werden',
              {
                classname: 'danger',
              }
            )
          )
        )
      );
  }

  confirm(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/confirm`, {})
      .pipe(
        tap(() => {
          this.toastService.show(
            'Best??tigung war erfolgreich und dem Mitglied konnte eine Best??tigung per Mail zugesendet werden',
            { classname: 'success', delay: 5000 }
          );
          this.executeRead();
        }),
        catchError((error) =>
          of(
            this.toastService.show('Bei der Best??tigung trat ein Fehler auf', {
              classname: 'danger',
            })
          )
        )
      );
  }

  revokeConfirm(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/revoke-confirm`, {})
      .pipe(
        tap(() => {
          this.toastService.show(
            'Die Best??tigung konnte erfolgreich zur??ckgenommen werden',
            { classname: 'success', delay: 5000 }
          );
          this.executeRead();
        }),
        catchError((error) =>
          of(
            this.toastService.show(
              'Beim zur??cknehmen der Best??tigung ist ein Fehler aufgetreten',
              {
                classname: 'danger',
              }
            )
          )
        )
      );
  }

  delete(taskId: string): Observable<void> {
    return this.httpClient.delete<void>(`${BASE_URL}/tasks/${taskId}`, {}).pipe(
      tap(() => {
        this.toastService.show(
          'Der Helfereinsatz konnte erfolgreich gel??scht werden',
          { classname: 'success', delay: 5000 }
        );
        this.executeRead();
      }),
      catchError((error) =>
        of(
          this.toastService.show('Helfereinsatz konnte nicht gel??scht werden', {
            classname: 'danger',
          })
        )
      )
    );
  }
  edit(taskId: string, task: AmtPosten): Observable<void> {
    return this.httpClient.put<void>(`${BASE_URL}/tasks/${taskId}`, task).pipe(
      tap(() => {
        this.toastService.show(
          'Der Helfereinsatz konnte erfolgreich editiert werden',
          { classname: 'success', delay: 5000 }
        );
        this.executeRead();
      }),
      catchError((error) =>
        of(
          this.toastService.show('Helfereinsatz konnte nicht editiert werden', {
            classname: 'danger',
          })
        )
      )
    );
  }

  downloadCsv(): Observable<ArrayBuffer> {
    const readOptions = this.readOptions$.value;
    return this.httpClient.get(BASE_URL + '/export', {
      params: { ...readOptions },
      responseType: 'arraybuffer',
    });
  }

  downloadCalendarEntry(taskId: string): Observable<string> {
    return this.httpClient.get(`${BASE_URL}/export/calendar/${taskId}`, {responseType: 'text'});
  }
}
