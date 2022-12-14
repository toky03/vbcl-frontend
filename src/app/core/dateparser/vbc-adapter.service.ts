import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ensureFmt, toDateStruct } from 'src/app/utils/date-utils';

@Injectable()
export class VbcAdapterService extends NgbDateAdapter<string> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) {
      return null;
    }
    return toDateStruct(value);
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date) {
      return date;
    }
    return `${date.year}-${ensureFmt(date.month)}-${ensureFmt(date.day)}`;
  }
}
