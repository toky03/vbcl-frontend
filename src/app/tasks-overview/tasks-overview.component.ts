import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { AmtPosten, ReadOptions } from '../core/model';
import { IntegrationService } from '../integration.service';

@Component({
  selector: 'app-tasks-overview',
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.css'],
})
export class TasksOverviewComponent implements OnInit {
  @Input() userName: string | undefined;
  @Output() markForEdit: EventEmitter<AmtPosten> = new EventEmitter();

  tasks$: Observable<AmtPosten[]> | undefined;
  readOptions$: Observable<ReadOptions> | undefined;
  roles: string[] | undefined;
  confirmAllowed: boolean = false;
  loading = false;

  constructor(
    private integration: IntegrationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.integration.readTasks();
    this.readOptions$ = this.integration.readSortingOptions();
    this.roles = this.authService.roles();
    this.confirmAllowed = this.roles.includes('tkAdmin');
  }

  reservieren(taskId: string) {
    this.loading = true;
    this.integration.reservate(taskId).subscribe(() => {
      this.loading = false;
    });
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
    sortColumn: 'startDatum' | 'dauer' | 'beschreibung',
    currentReadOptions: ReadOptions
  ) {
    let sorting: 'ASC' | 'DESC' = 'ASC';
    if (sortColumn === currentReadOptions.sortColumn) {
      sorting = currentReadOptions.sorting === 'ASC' ? 'DESC' : 'ASC';
    }
    this.integration.updateSorting({ sortColumn, sorting });
  }
}
