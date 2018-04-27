import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { User } from '../User';
import { InputComponent } from '../input/input.component';

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

  @ViewChildren(InputComponent)
  childComps: QueryList<InputComponent>;

  constructor(private authService: AuthService) {
    this.show = false;
    this.state = 'hidden';
    authService.showLogin.subscribe(
      (url: string) => {
        if (url) {
          this.childComps.forEach(c => c.reset());
          this.url = url;
          this.show = true;
          this.state = 'shown';
          this.childComps.first.focus();
        }
      }
    );
   }

  doLogin() {
    this.authService.doLogin(
          this.url,
          this.childComps.first.value,
          this.childComps.last.value)
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
