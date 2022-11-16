import { Component, OnChanges, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Observable, of } from 'rxjs';
import { AuthService } from './core/auth.service';
import { AmtPosten } from './core/model';
import { IntegrationService } from './integration.service';
import { LoadingCounterService } from './loading/loading-counter.service';
import { createLink } from './utils/fiel-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  authenticated$: Observable<boolean> = of(false);

  givenName$: Observable<string | undefined> | undefined;
  userName$: Observable<string | undefined> | undefined;
  allowedCreate: boolean = false;
  allowedDownload: boolean = false;
  isLoading$: Observable<boolean> | undefined;

  taskForEdit: AmtPosten | undefined;

  constructor(
    private authService: AuthService,
    private integration: IntegrationService,
    private loadingCounterService: LoadingCounterService
  ) {}

  ngOnInit(): void {
    this.authenticated$ = this.authService.isAuthenticated();
    this.givenName$ = this.authService.givenName;
    this.userName$ = this.authService.userName;
    this.allowedCreate = this.authService.roles().includes('tkAdmin');
    this.allowedDownload = this.authService.roles().includes('vorstand');
    this.isLoading$ = this.loadingCounterService.isLoading();
  }

  logout(): void {
    this.authService.logout();
  }

  login(): void {
    this.authService.login();
  }

  sendToEdit(task: AmtPosten): void {
    this.taskForEdit = task;
  }

  taskEdited() {
    this.taskForEdit = undefined;
  }

  download() {
    this.integration.downloadCsv().subscribe((data) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const filename = `vbcl_arbeitsliste_${format(
        new Date(),
        'yyyyMMdd_HHmmss'
      )}.csv`;
      createLink(filename, url);
    });
  }
}
