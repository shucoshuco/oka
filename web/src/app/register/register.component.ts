import { Component, Input, ViewChildren, QueryList } from '@angular/core';
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
import { InputComponent } from '../input/input.component';


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
  gender: Gender;

  @ViewChildren(InputComponent)
  childComps: QueryList<InputComponent>;

  constructor(private authService: AuthService) {
    this.show = false;
    this.state = 'hidden';
    authService.showRegistry.subscribe(
      (data: any) => {
        this.childComps.forEach(c => c.reset());
        this.gender = null;
        this.show = true;
        this.state = 'shown';
      });
   }

  doRegister() {
    this.authService.doRegister(
      this.childComps.first.value,
      this.childComps.toArray()[1].value,
      this.childComps.last.value,
      this.gender)
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
