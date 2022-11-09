import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastOptions {
  classname?: 'danger' | 'success' | 'warning';
  delay?: number;
}

export interface Toast {
  text: string;
  options: {
    classname: string;
    delay?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts$: BehaviorSubject<Toast[]> = new BehaviorSubject<Toast[]>([]);

  show(text: string, options: ToastOptions = { classname: 'success' }) {
    this.toasts$.next([
      ...this.toasts$.value,
      {
        text,
        options: {
          ...options,
          classname: `bg-${options.classname} text-light`,
        },
      },
    ]);
  }

  remove(toast: Toast) {
    this.toasts$.next(this.toasts$.value.filter((t) => t !== toast));
  }

  clear() {
    this.toasts$.next(this.toasts$.value.splice(0, this.toasts$.value.length));
  }

  getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }
}
