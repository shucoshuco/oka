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
import { Router } from '@angular/router';

@Injectable()
export class OkaGameApiService {

  constructor(
    private http: HttpClient,
    private toasterService: ToasterService,
    private router: Router
  ) { }

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

  startGame(url) {
    this.http.post<string>(buildApiUrl(url), "", {withCredentials: true}).pipe(
      tap((game: string) => console.log(`New game with id=${game['id']}`)),
      catchError(this.handleError<string>('Unable to create new game'))
    ).subscribe(
      game => {
        if (game) {
          this.router.navigateByUrl('/games/anonymous/currentGame');
        }
      });
  }

  startNewAnonymousGame() {
    this.startGame('/games/oka/create/anonymous');
  }

  startNewGame() {
    this.startGame('/games/oka/create/default');
  }

  getGame(): Observable<object> {
    const url = buildApiUrl(`/games/oka/currentGame`);
    return this.http.get(url, {withCredentials: true}).pipe(
      tap(game => console.log(`Retrieved game with id=${game['id']}`)),
      catchError(this.handleError<object>(`Unable to get details of currentGame`))
    );
  }

  rollDice(): Observable<Movement> {
    const url = buildApiUrl(`/games/oka/currentGame/roll-dice`);
    return this.http.post<Movement>(url, new Movement(), {withCredentials: true}).pipe(
      tap((movement: Movement) => console.log(`Rolled current game`)),
      catchError(this.handleError<Movement>(`Unable to roll dice for current game`))
    );
  }

  getCellDetail(cell: Cell): Observable<any> {
    const url = buildApiUrl(`/games/oka/cells/${cell.id}`);
    return this.http.get<any>(url, {withCredentials: true}).pipe(
      tap((cellDetail: any) => console.log(`Fetched cell with id=${cell.id}`)),
      catchError(this.handleError<any>(`Unable to get details of cell ${cell.id}`))
    );
  }

  getOkaDetail(pendingItems: boolean): Observable<any> {
    const url = buildApiUrl(`/games/oka/cells/oka`);
    return this.http.get<any>(url, {
        withCredentials: true,
        params: {
          'pendingItems': pendingItems.toString()
        }
      }).pipe(
        tap((cellDetail: any) => console.log(`Fetched oka`)),
        catchError(this.handleError<any>('Unable to get details of oka'))
    );
  }
}
