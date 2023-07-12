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

@Injectable({ providedIn: 'root' })
export class IntegrationService {
  private initialReadOptions: ReadOptions = {
    sortColumn: 'startDatum',
    sorting: 'ASC',
  };

  private triggerReadSubject$: Subject<string> = new Subject();

  private readOptions$: BehaviorSubject<ReadOptions> = new BehaviorSubject(
    this.initialReadOptions
  );

  private tasksRead: { [eventName: string]: Subject<AmtPosten[]> } = {};

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService
  ) {
    this.triggerReadSubject$.subscribe((eventName: string) => {
      this.httpClient
        .get<AmtPosten[]>(BASE_URL + '/tasks/' + eventName, {
          params: { ...this.readOptions$.value },
        })
        .subscribe((tasks) => {
          this.tasksRead[eventName].next(tasks);
        });
    });
  }

  private executeRead(): void {
    const eventNames: string[] = Object.keys(this.tasksRead);
    eventNames.forEach((eventName: string) => {
      this.triggerReadSubject$.next(eventName);
    });
  }

  updateSorting(readOptions: ReadOptions): void {
    this.readOptions$.next(readOptions);
    this.executeRead();
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

  readTasks(eventName: string): Observable<AmtPosten[]> {
    if (!this.tasksRead[eventName]) {
      this.tasksRead[eventName] = new Subject();
    }
    this.triggerReadSubject$.next(eventName);
    return this.tasksRead[eventName];
  }

  reservate(taskId: string): Observable<void> {
    return this.httpClient
      .put<void>(`${BASE_URL}/tasks/${taskId}/reservate`, {})
      .pipe(
        tap(() => {
          this.toastService.show(
            'Der Helfereinsatz wurde für dich reserviert. Sobald dieser vom TK Admin bestätigt wurde erhälst du eine E-Mail',
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
            'Bestätigung war erfolgreich und dem Mitglied konnte eine Bestätigung per Mail zugesendet werden',
            { classname: 'success', delay: 5000 }
          );
          this.executeRead();
        }),
        catchError((error) =>
          of(
            this.toastService.show('Bei der Bestätigung trat ein Fehler auf', {
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
            'Die Bestätigung konnte erfolgreich zurückgenommen werden',
            { classname: 'success', delay: 5000 }
          );
          this.executeRead();
        }),
        catchError((error) =>
          of(
            this.toastService.show(
              'Beim zurücknehmen der Bestätigung ist ein Fehler aufgetreten',
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
          'Der Helfereinsatz konnte erfolgreich gelöscht werden',
          { classname: 'success', delay: 5000 }
        );
        this.executeRead();
      }),
      catchError((error) =>
        of(
          this.toastService.show('Helfereinsatz konnte nicht gelöscht werden', {
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
    return this.httpClient.get(`${BASE_URL}/export/calendar/${taskId}`, {
      responseType: 'text',
    });
  }
}
