import { Component } from '@angular/core';
import {imagesPath} from './globals';
import {ToasterConfig} from 'angular2-toaster'
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'OKAsutra';
  imagesPath = imagesPath;
  config: ToasterConfig = 
    new ToasterConfig({animation: 'fade'});

  loggedIn;
  username;

  constructor(private authService: AuthService, private router: Router) {
    authService.loginChange.subscribe((login) => {
      this.loggedIn = login;
      if (login) {
        authService.getUser().subscribe(user => this.username = user.name);
      }
    })
  }

  doLogin(event) {
    this.router.navigateByUrl('/userhome');
  };

  doLogout(event) {
    this.authService.doLogout();
  }
}
