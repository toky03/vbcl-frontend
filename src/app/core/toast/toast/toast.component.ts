import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
  },
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts$: Observable<Toast[]> | undefined;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toasts$ = this.toastService.getToasts();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  remove(toast: Toast) {
    this.toastService.remove(toast);
  }
}
