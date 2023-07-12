import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class EventIntegrationService {
  readEventNames(): Observable<string[]> {
    return this.httpClient.get<string[]>(BASE_URL + '/tasks/events');
  }
  constructor(private httpClient: HttpClient) {}
}
