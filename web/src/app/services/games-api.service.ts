import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { buildApiUrl } from '../globals';
import { Game } from '../Game';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class GamesApiService {

  constructor(private http: HttpClient) { }

  private handleError (result?: Game[]) {
    return (error: any): Observable<Game[]> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as Game[]);
    }
  }

  loadAvailableGames() {
    return this.http.get<Game[]>(buildApiUrl('/games/available'), {withCredentials: true})
        .pipe(
          tap((games) => console.log("Games retrieved")),
          catchError(this.handleError()));
  }

  loadFrequentGames() {
    return this.http.get<Game[]>(buildApiUrl('/games/frequent'), {withCredentials: true})
        .pipe(
          tap((games) => console.log("Games retrieved")),
          catchError(this.handleError()));
  }

  loadPreferredGames() {
    return this.http.get<Game[]>(buildApiUrl('/games/user/preferred'), {withCredentials: true})
        .pipe(
          tap((games) => console.log("Games retrieved")),
          catchError(this.handleError()));
  }
}
