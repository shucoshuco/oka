import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.scss']
})
export class UserhomeComponent implements OnInit {

  user;
  lastGames;
  availableGames;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => this.user = user);
    this.lastGames = [];
    this.availableGames = [];
  }

}
