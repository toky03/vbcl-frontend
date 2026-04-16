import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AmtPosten } from '../core/model';
import { EventIntegrationService } from '../event-integration.service';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { IntegrationService } from '../integration.service';

@Component({
    selector: 'app-events-overview',
    templateUrl: './events-overview.component.html',
    styleUrls: ['./events-overview.component.css'],
    standalone: false
})
export class EventsOverviewComponent implements OnInit {
  @Output() markForEdit: EventEmitter<AmtPosten> =
    new EventEmitter<AmtPosten>();

  eventNames$: Observable<string[]> = this.integrationService
    .readSortingOptions()
    .pipe(
      switchMap(({ includeOldEvents }) =>
        this.eventIntegrationService.readEventNames(includeOldEvents)
      )
    );

  includeOldEvents = false;
  canIncludeOldEvents = false;

  edit(event: AmtPosten) {
    this.markForEdit.next(event);
  }

  constructor(
    private eventIntegrationService: EventIntegrationService,
    private authService: AuthService,
    private integrationService: IntegrationService
  ) {}

  ngOnInit(): void {
    this.canIncludeOldEvents = this.authService.roles().includes('tkAdmin');
    this.includeOldEvents = false;
  }

  toggleIncludeOldEvents(): void {
    this.includeOldEvents = !this.includeOldEvents;
    this.integrationService.updateIncludeOldEvents(this.includeOldEvents);
  }
}
