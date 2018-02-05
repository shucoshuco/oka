import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import { Game } from './Game';
import {Movement} from './Movement';

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
  getBoard(): Observable<Game> {
    return this.http.post<Game>(this.gamesUrl, new Game()).pipe(
      tap((game: Game) => console.log(`New game with id=${game.id}`)),
      catchError(this.handleError<Game>('createGame'))
    );
  }

  rollDice(gameId: string): Observable<Movement> {
    const url = `http://192.168.1.105:8080/games/user/${gameId}/roll-dice`;
    return this.http.post<Movement>(url, new Movement()).pipe(
      tap((movement: Movement) => console.log(`Rolled game with id=${gameId}`)),
      catchError(this.handleError<Movement>('createGame'))
    );
  }
}
