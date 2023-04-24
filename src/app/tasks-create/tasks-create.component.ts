import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbTimeAdapter,
} from '@ng-bootstrap/ng-bootstrap';
import {VbcAdapterService} from '../core/dateparser/vbc-adapter.service';
import {VbcCustomDateParserService} from '../core/dateparser/vbc-custom-date-parser.service';
import {AmtPosten} from '../core/model';
import {VbcTimeAdapterService} from '../core/timeparser/vbc-time-adapter.service';
import {IntegrationService} from '../integration.service';

@Component({
  selector: 'app-tasks-create',
  templateUrl: './tasks-create.component.html',
  styleUrls: ['./tasks-create.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: VbcAdapterService},
    {provide: NgbDateParserFormatter, useClass: VbcCustomDateParserService},
    {provide: NgbTimeAdapter, useClass: VbcTimeAdapterService},
  ],
})
export class TasksCreateComponent implements OnInit, OnChanges {
  taksForm: FormGroup | undefined;

  @Input() taskForEdit: AmtPosten | undefined;
  @Output() taskEdited: EventEmitter<void> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private integrationService: IntegrationService
  ) {
  }

  ngOnInit(): void {
    this.taksForm = this.formBuilder.group({
      datum: ['', Validators.required],
      beschreibung: ['', Validators.required],
      eventName: ['', Validators.required],
      dauer: [0],
      startZeit: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.taskForEdit && this.taksForm) {
      const splittedDate = this.taskForEdit.startDatum.split(' ');
      const datum = splittedDate[0];
      const startZeit = splittedDate[1];
      this.taksForm.reset({
        datum: datum,
        eventName: this.taskForEdit.eventName,
        beschreibung: this.taskForEdit.beschreibung,
        dauer: this.taskForEdit.dauer,
        startZeit: startZeit,
      });
    }
  }

  save(): void {
    if (!this.taksForm) {
      return;
    }
    if (this.taskForEdit) {
      this.integrationService
        .edit(this.taskForEdit.id, mergeForm(this.taksForm.value))
        .subscribe(() => {
          this.taksForm?.reset();
          this.taskEdited.emit();
        });
    } else {
      this.integrationService
        .saveTask(mergeForm(this.taksForm.value))
        .subscribe(() => {
          this.taksForm?.reset();
        });
    }
  }

  cancel() {
    this.taksForm?.reset();
    this.taskEdited.emit();
  }
}

function mergeForm(task: TaskFormValues): AmtPosten {
  return {
    id: '',
    startDatum: `${task.datum} ${task.startZeit}`,
    eventName: task.eventName,
    beschreibung: task.beschreibung,
    dauer: !!task.dauer ? task.dauer : 0,
  };
}

interface TaskFormValues {
  datum: string | Date;
  eventName: string;
  beschreibung: string;
  dauer: number;
  startZeit: string;
}
