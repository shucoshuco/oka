import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, tap} from 'rxjs/operators';
import { buildApiUrl } from '../globals';
import { User } from '../User';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ToasterService, Toast } from 'angular2-toaster'
import { Gender } from '../Gender';

@Injectable()
export class AuthService {

  loggedIn: boolean;
  user: User;
  userObservable: Observable<User>;

  showLogin: Observable<string>;
  private loginSubject: Subject<string>;

  showRegistry: Observable<string>;
  private registrySubject: Subject<string>;

  loginChange: Observable<boolean>;
  private loginChangeSubject: Subject<boolean>;

  constructor(
      private http: HttpClient, private router: Router,
      private toasterService: ToasterService)
  {
    this.loginSubject = new Subject<string>();
    this.showLogin = this.loginSubject.asObservable();

    this.registrySubject = new Subject<string>();
    this.showRegistry = this.registrySubject.asObservable();

    this.loginChangeSubject = new Subject<boolean>();
    this.loginChange = this.loginChangeSubject.asObservable();

    this.initialLoadUser().subscribe();
  }

  private handleLoginError (result?: User) {
    return (error: any): Observable<User> => {
      console.error(error);
      this.removeUser();
      var toast: Toast = {
        type: 'error',
        showCloseButton: true
      };
      switch (error.status) {
        case 401: toast.title = 'Unknown user'; break;
        case 403: toast.title = 'Unauthorized'; break;
        default: toast.title = 'Error doing login'; break;
      }
      this.toasterService.pop(toast);
      // Let the app keep running by returning an empty result.
      return of(result as User);
    }
  }

  private handleRegisterError (result?: string) {
    return (error: any): Observable<String> => {
      console.error(error);
      var toast: Toast = {
        type: 'error',
        showCloseButton: true,
      };
      switch (error.status) {
        case 400:
        case 404: toast.title = error.error; break;
        case 500: toast.title = 'Server internal error'; break;
      }
      this.toasterService.pop(toast);
      // Let the app keep running by returning an empty result.
      return of(result as string);
    }
  }

  private initialLoadUser() {
    return this.userObservable = 
        this.http.get<User>(buildApiUrl('/users/current'), {withCredentials: true})
          .pipe(
            tap((user) => {
              console.log("User retrieved");
              this.user = user;
              this.loginChangeSubject.next(true);
              this.loggedIn = true;
            }));
  }

  private loadUser() {
    this.loggedIn = true;
    this.userObservable = 
      this.http.get<User>(buildApiUrl('/users/current'), {withCredentials: true})
        .pipe(
          tap((user) => {
            console.log("User retrieved");
            this.user = user;
            this.loginChangeSubject.next(true);
          }),
          catchError(this.handleLoginError()));
  }

  private removeUser() {
    this.loggedIn = false;
    this.user = undefined;
    this.userObservable = undefined;
    this.loginChangeSubject.next(false);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getUser(): Observable<User> {
    if (this.user !== undefined) {
      return of(this.user);
    }
    return this.userObservable;
  }

  startLogin(url = '/userhome') {
    this.loginSubject.next(url);
  }

  startRegistry() {
    if (this.user !== undefined) {
      this.router.navigateByUrl('/userhome');
    } else {
      this.registrySubject.next('foo');
    }
  }

  doLogin(url: string, username: string, password: string) {
    let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    let options = {
      withCredentials: true,
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let result = null;

    return this.http.post<string>(buildApiUrl('/login'), body.toString(), options)
      .pipe(
        tap(() => {
          console.log("Successul login");
          this.loadUser();
          var toast: Toast = {
            type: 'success',
            showCloseButton: true,
            title: 'Succesful login',
          };
          this.toasterService.pop(toast);
          this.router.navigateByUrl(url);
        }),
        catchError(this.handleLoginError()));
  }

  doLogout() {
    this.http.post(buildApiUrl('/logout'), {}, {withCredentials: true})
      .pipe(
        tap((response) => {
          console.log("Succesful logout");
        })).subscribe();
    this.removeUser();
    this.router.navigateByUrl('/');
  }

  doRegister(username: String, password: String,  
              confirmPassword: String, gender: Gender)
  {
    return this.http.post<User>(buildApiUrl('/users'), {
      username, password, confirmPassword, gender
    }).pipe(
      tap(() => {
        var toast: Toast = {
          type: 'success',
          showCloseButton: true,
          title: 'Successful registry. Try login now'
        }
        this.toasterService.pop(toast);          
      }),
      catchError(this.handleRegisterError()))
  }
}
