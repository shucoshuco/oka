import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import {Movement} from './Movement';
import {Cell} from './Cell';
import {Player} from './Player';
import {buildApiUrl} from '../../globals';
import { ToasterService, Toast } from 'angular2-toaster'

@Injectable()
export class OkaGameApiService {

  constructor(
    private http: HttpClient,
    private toasterService: ToasterService) { }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      var toast: Toast = {
        type: 'error',
        title: operation,
        showCloseButton: true
      };
      this.toasterService.pop(toast);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  newAnonymousGame(): Observable<string> {
    const url = buildApiUrl('/games/oka/create/anonymous');
    return this.http.post<string>(url, "").pipe(
      tap((game: string) => console.log(`New game with id=${game['id']}`)),
      catchError(this.handleError<string>('Unable to create new anonymous game'))
    );
  }

  getGame(gameId: string): Observable<object> {
    const url = buildApiUrl(`/games/oka/${gameId}`);
    return this.http.get(url).pipe(
      tap(game => console.log(`Retrieved game with id=${game['id']}`)),
      catchError(this.handleError<object>(`Unable to get details of game ${gameId}`))
    );
  }

  rollDice(gameId: string): Observable<Movement> {
    const url = buildApiUrl(`/games/oka/${gameId}/roll-dice`);
    return this.http.post<Movement>(url, new Movement()).pipe(
      tap((movement: Movement) => console.log(`Rolled game with id=${gameId}`)),
      catchError(this.handleError<Movement>(`Unable to roll dice for game ${gameId}`))
    );
  }

  getCellDetail(cell: Cell): Observable<any> {
    const url = buildApiUrl(`/games/oka/cells/${cell.id}`);
    return this.http.get<any>(url, {}).pipe(
      tap((cellDetail: any) => console.log(`Fetched cell with id=${cell.id}`)),
      catchError(this.handleError<any>(`Unable to get details of cell ${cell.id}`))
    );
  }

  getOkaDetail(pendingItems: boolean): Observable<any> {
    const url = buildApiUrl(`/games/oka/cells/oka`);
    return this.http.get<any>(url, {params: {'pendingItems': pendingItems.toString()}}).pipe(
      tap((cellDetail: any) => console.log(`Fetched oka`)),
      catchError(this.handleError<any>('Unable to get details of oka'))
    );
  }
}
