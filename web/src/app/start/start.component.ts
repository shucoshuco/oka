import { Component, OnInit } from '@angular/core';
import { OkaGameApiService } from '../games/oka/oka-game-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  loading: boolean;

  constructor(
      private gameApi: OkaGameApiService,
      private authService: AuthService,
      private router: Router) { }

  ngOnInit() {
    this.loading = false;
  }

  showLogin(event) {
    this.router.navigateByUrl('/userhome');
  };

  showRegistry(event) {
    this.authService.startRegistry();
  }

  startDefault() {
    this.gameApi.startNewAnonymousGame();
  };
}
