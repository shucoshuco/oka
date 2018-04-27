import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GamesApiService } from '../services/games-api.service';
import { imagesPath } from '../globals';
import { Router } from '@angular/router';
import { OkaGameApiService } from '../games/oka/oka-game-api.service';
import { DicesGameApiService } from '../games/dices/dices-game-api.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.scss']
})
export class UserhomeComponent implements OnInit {

  user;
  lastAccess;
  registerDate;

  lastGames;
  availableGames;
  frequentGames;
  preferredGames;

  gameServices: Object[];

  constructor(
    private authService: AuthService,
    private gamesService: GamesApiService,
    private okaGameService: OkaGameApiService,
    private dicesGameService: DicesGameApiService) {
      this.gameServices = [];
      this.gameServices[1] = okaGameService;
      this.gameServices[2] = dicesGameService;
     }
  

  ngOnInit() {
    this.authService.getUser()
      .subscribe((user) => {
        this.user = user;
        this.lastAccess = Date.parse(user.lastAccess);
        this.registerDate = Date.parse(user.registerDate);
      });
    this.lastGames = [];
    this.gamesService.loadAvailableGames()
      .subscribe((games) => {
        games.forEach(game => game.image = imagesPath + game.image);
        this.availableGames = games;
      });
    this.gamesService.loadFrequentGames()
      .subscribe((games) => {
        games.forEach(game => game.image = imagesPath + game.image);
        this.frequentGames = games;
      });
    this.gamesService.loadPreferredGames()
      .subscribe((games) => {
        games.forEach(game => game.image = imagesPath + game.image);
        this.preferredGames = games;
      });
    
  }

  startNewGame(idGame: string) {
    this.gameServices[idGame].startNewGame();
  }
}
