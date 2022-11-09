import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VbcDatePipe } from './dateparser/date.pipe';
import { ToastComponent } from './toast/toast/toast.component';
import { ToastService } from './toast/toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    VbcDatePipe,
    ToastComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule
  ],
  exports: [
    VbcDatePipe,
    ToastComponent
  ]
})
export class CoreModule { }
