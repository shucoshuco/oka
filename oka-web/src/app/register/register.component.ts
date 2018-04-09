import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { User } from '../User';
import { Gender } from '../Gender';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('registerWindow', [
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
export class RegisterComponent {

  show: boolean;
  state: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: Gender;

  constructor(private authService: AuthService) {
    this.show = false;
    this.state = 'hidden';
    authService.showRegistry.subscribe(
      (data: any) => {
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.gender = null;
        this.show = true;
        this.state = 'shown';
      });
   }

  doRegister() {
    this.authService.doRegister(
      this.username, this.password, this.confirmPassword, this.gender)
      .subscribe((error: string) => {
        if (error === null ) {
          this.state = 'hidden';
          this.show = false;
          console.log("User registered in");
        }
      });
  }

  cancelRegister() {
    this.state = 'hidden';
    this.show = false;
  }
}
