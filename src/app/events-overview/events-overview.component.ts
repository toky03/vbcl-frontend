import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AmtPosten } from '../core/model';
import { EventIntegrationService } from '../event-integration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events-overview',
  templateUrl: './events-overview.component.html',
  styleUrls: ['./events-overview.component.css'],
})
export class EventsOverviewComponent implements OnInit {
  @Output() markForEdit: EventEmitter<AmtPosten> =
    new EventEmitter<AmtPosten>();

  eventNames$: Observable<string[]> =
    this.eventIntegrationService.readEventNames();

  edit(event: AmtPosten) {
    this.markForEdit.next(event);
  }

  constructor(private eventIntegrationService: EventIntegrationService) {}

  ngOnInit(): void {}
}
