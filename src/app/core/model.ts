export interface AmtPosten {
  bestaetigt?: boolean;
  id: string;
  datum: string;
  dauer: string;
  startZeit: string;
  beschreibung: string;
  reservation?: User;
}

export interface User {
  id: string;
  name: string;
}

export interface ReadOptions {
  sorting: 'ASC' | 'DESC';
  sortColumn: 'datum' | 'dauer' | 'beschreibung';
}
