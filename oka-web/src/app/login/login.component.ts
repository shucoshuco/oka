import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { User } from '../User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('loginWindow', [
      state('hidden', style({
        top: '-100px',
        opacity: 0,
      })),
      state('shown', style({
        top: '40%',
        opacity: 1,
      })),
      transition('hidden <=> shown', animate('500ms ease-in-out')),
    ])
  ]
})
export class LoginComponent {

  url: string;
  show: boolean;
  state: string;
  username: string;
  password: string;

  constructor(private authService: AuthService) {
    this.show = false;
    this.state = 'hidden';
    authService.showLogin.subscribe(
      (url: string) => {
        if (url) {
          this.username = '';
          this.password = '';
          this.url = url;
          this.show = true;
          this.state = 'shown';
        }
      }
    );
   }

  doLogin() {
    this.authService.doLogin(this.url, this.username, this.password)
      .subscribe((error: string) => {
        if (error === null) {
          this.state = 'hidden';
          this.show = false;
          console.log("User logged in");
        }
      });
  }

  cancelLogin() {
    this.state = 'hidden';
    this.show = false;
  }
}
