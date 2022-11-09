export interface AmtPosten {
  bestaetigt?: boolean;
  id: string;
  startDatum: string;
  dauer: number;
  beschreibung: string;
  reservation?: User;
}

export interface User {
  id: string;
  name: string;
}

export interface ReadOptions {
  sorting: 'ASC' | 'DESC';
  sortColumn: 'startDatum' | 'dauer' | 'beschreibung';
}
