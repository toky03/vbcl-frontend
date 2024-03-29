import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { AmtPosten, ReadOptions } from '../core/model';
import { IntegrationService } from '../integration.service';
import { createLink } from '../utils/fiel-utils';

@Component({
  selector: 'app-tasks-overview',
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.css'],
})
export class TasksOverviewComponent implements OnInit, OnChanges {
  @Output() markForEdit: EventEmitter<AmtPosten> = new EventEmitter();
  @Input() eventName: string | undefined;

  tasks$: Subject<AmtPosten[]> = new Subject();
  readOptions$: Observable<ReadOptions> | undefined;
  userName$: Observable<string | undefined> | undefined;
  roles: string[] | undefined;
  confirmAllowed: boolean = false;

  constructor(
    private integration: IntegrationService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventName'] && this.eventName) {
      this.integration
        .readTasks(this.eventName)
        .subscribe((tasks: AmtPosten[]) => {
          this.tasks$.next(tasks);
        });
    }
  }

  ngOnInit(): void {
    this.readOptions$ = this.integration.readSortingOptions();
    this.userName$ = this.authService.userName;
    this.roles = this.authService.roles();
    this.confirmAllowed = this.roles.includes('tkAdmin');
  }

  reservieren(taskId: string) {
    this.integration.reservate(taskId).subscribe(() => {});
  }

  bestaetigen(taskId: string) {
    this.integration.confirm(taskId).subscribe(() => {});
  }
  entferneBestaetigung(taskId: string): void {
    this.integration.revokeConfirm(taskId).subscribe(() => {});
  }

  entferneReservation(taskId: string) {
    this.integration.revokeReservation(taskId).subscribe(() => {});
  }

  delete(taskId: string): void {
    this.integration.delete(taskId).subscribe(() => {});
  }

  edit(task: AmtPosten): void {
    this.markForEdit.emit(task);
  }

  calculateArrow(sorting: 'ASC' | 'DESC'): string {
    const direction = sorting === 'ASC' ? 'up' : 'down';
    return `bi bi-arrow-${direction}-short`;
  }

  updateOptions(
    sortColumn: 'startDatum' | 'dauer' | 'beschreibung' | 'eventName',
    currentReadOptions: ReadOptions
  ) {
    let sorting: 'ASC' | 'DESC' = 'ASC';
    if (sortColumn === currentReadOptions.sortColumn) {
      sorting = currentReadOptions.sorting === 'ASC' ? 'DESC' : 'ASC';
    }
    this.integration.updateSorting({ sortColumn, sorting });
  }

  downloadCalendar(task: AmtPosten) {
    this.integration
      .downloadCalendarEntry(task.id)
      .subscribe((data: string) => {
        const blob = new Blob([data], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const filename = `${task.beschreibung}.ics`;
        createLink(filename, url);
      });
  }
}
