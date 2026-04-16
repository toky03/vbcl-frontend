import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TasksOverviewComponent } from './tasks-overview.component';
import { AuthService } from '../core/auth.service';
import { IntegrationService } from '../integration.service';

describe('TasksOverviewComponent', () => {
  let component: TasksOverviewComponent;
  let fixture: ComponentFixture<TasksOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksOverviewComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            userName: of('test-user'),
            roles: () => [],
          },
        },
        {
          provide: IntegrationService,
          useValue: {
            readSortingOptions: () =>
              of({
                sortColumn: 'startDatum',
                sorting: 'ASC',
                includeOldEvents: false,
              }),
            readTasks: () => of([]),
            reservate: () => of(undefined),
            confirm: () => of(undefined),
            revokeConfirm: () => of(undefined),
            revokeReservation: () => of(undefined),
            delete: () => of(undefined),
            updateSorting: () => {},
            updateIncludeOldEvents: () => {},
            downloadCalendarEntry: () => of(''),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
