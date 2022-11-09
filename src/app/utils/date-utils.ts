import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { format, parseISO } from 'date-fns';

export function ensureFmt(input: number): string {
  return input < 10 ? `0${input}` : `${input}`;
}

export function prettyFormat(inputDate: string): string {
  return format(parseISO(inputDate), 'dd.MM.yyyy HH:mm');
}

export function toDateStruct(isoDate: string): NgbDateStruct {
    const date = isoDate.split('-');
    return {
        day: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[0], 10),
      };


}
