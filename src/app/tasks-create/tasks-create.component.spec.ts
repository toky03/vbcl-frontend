import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { TasksCreateComponent } from './tasks-create.component';
import { IntegrationService } from '../integration.service';

describe('TasksCreateComponent', () => {
  let component: TasksCreateComponent;
  let fixture: ComponentFixture<TasksCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksCreateComponent],
      imports: [ReactiveFormsModule, NgbModule],
      providers: [
        {
          provide: IntegrationService,
          useValue: {
            saveTask: () => of(undefined),
            edit: () => of(undefined),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
