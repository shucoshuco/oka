import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import {Movement} from './Movement';
import {Cell} from './Cell';
import {Player} from './Player';

@Injectable()
export class GameApiService {

  private gamesUrl = 'http://192.168.1.105:8080/games/user/create/anonymous';

  constructor(private http: HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET heroes from the server */
  getBoard(): Observable<object> {
    return this.http.post(this.gamesUrl, {}).pipe(
      tap(game => console.log(`New game with id=${game['id']}`)),
      catchError(this.handleError('createGame'))
    );
  }

  rollDice(gameId: string): Observable<Movement> {
    const url = `http://192.168.1.105:8080/games/user/${gameId}/roll-dice`;
    return this.http.post<Movement>(url, new Movement()).pipe(
      tap((movement: Movement) => console.log(`Rolled game with id=${gameId}`)),
      catchError(this.handleError<Movement>('createGame'))
    );
  }

  getCellDetail(cell: Cell): Observable<any> {
    const url = `http://192.168.1.105:8080/cells/${cell.id}`;
    return this.http.get<any>(url, {}).pipe(
      tap((cellDetail: any) => console.log(`Fetched cell with id=${cell.id}`)),
      catchError(this.handleError<any>('getCellDetail'))
    );
  }

  getOkaDetail(pendingItems: boolean): Observable<any> {
    const url = `http://192.168.1.105:8080/cells/oka`;
    return this.http.get<any>(url, {params: {'pendingItems': pendingItems.toString()}}).pipe(
      tap((cellDetail: any) => console.log(`Fetched oka`)),
      catchError(this.handleError<any>('getCellDetail'))
    );
  }
}
