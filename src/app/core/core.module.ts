import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VbcDatePipe } from './dateparser/date.pipe';



@NgModule({
  declarations: [
    VbcDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VbcDatePipe
  ]
})
export class CoreModule { }
