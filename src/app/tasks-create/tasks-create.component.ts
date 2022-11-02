import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { parseISO } from 'date-fns';
import { VbcAdapterService } from '../core/dateparser/vbc-adapter.service';
import { VbcCustomDateParserService } from '../core/dateparser/vbc-custom-date-parser.service';
import { AmtPosten } from '../core/model';
import { IntegrationService } from '../integration.service';
import { ensureFmt } from '../utils/date-utils';

@Component({
  selector: 'app-tasks-create',
  templateUrl: './tasks-create.component.html',
  styleUrls: ['./tasks-create.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: VbcAdapterService },
    { provide: NgbDateParserFormatter, useClass: VbcCustomDateParserService },
  ],
})
export class TasksCreateComponent implements OnInit, OnChanges {
  taksForm: FormGroup | undefined;

  @Input() taskForEdit: AmtPosten | undefined;
  @Output() taskEdited: EventEmitter<void> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private integrationService: IntegrationService
  ) {}

  ngOnInit(): void {
    this.taksForm = this.formBuilder.group({
      datum: ['', Validators.required],
      beschreibung: ['', Validators.required],
      dauer: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.taskForEdit && this.taksForm) {
      this.taksForm.reset({
        datum: this.taskForEdit.datum,
        beschreibung: this.taskForEdit.beschreibung,
        dauer: this.taskForEdit.dauer,
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

function mergeForm(task: any): AmtPosten {
  return {
    id: '',
    datum: task.datum,
    beschreibung: task.beschreibung,
    dauer: task.dauer,
  };
}


