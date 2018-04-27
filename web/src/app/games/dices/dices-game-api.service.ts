import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import {buildApiUrl} from '../../globals';
import { ToasterService, Toast } from 'angular2-toaster'
import { Router } from '@angular/router';
import { Movement } from './Movement';

@Injectable()
export class DicesGameApiService {

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

  startNewGame() {
    this.newAnonymousGame().subscribe(
      game => {
        if (game) {
          this.router.navigateByUrl(`/games/dices/currentGame`);
        }
      });
  }

  newAnonymousGame(): Observable<object> {
    const url = buildApiUrl('/games/dices/create/anonymous');
    return this.http.post<object>(url, "", {withCredentials: true}).pipe(
      tap((game: object) => console.log(`New dices game with id=${game['id']}`)),
      catchError(this.handleError<object>('Unable to create new anonymous game'))
    );
  }

  getGame(): Observable<object> {
    const url = buildApiUrl('/games/dices/currentGame');
    return this.http.get(url, {withCredentials: true}).pipe(
      tap(game => console.log(`Retrieved game with id=${game['id']}`)),
      catchError(this.handleError<object>(`Unable to get details of current game`))
    );
  }

  rollDice(): Observable<Movement> {
    const url = buildApiUrl('/games/dices/currentGame/roll-dice');
    return this.http.post<Movement>(url, new Movement(), {withCredentials: true}).pipe(
      tap((movement: Movement) => console.log('Current game rolled')),
      catchError(this.handleError<Movement>(`Unable to roll dice for current game`))
    );
  }
}
