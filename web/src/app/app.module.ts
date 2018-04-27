import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';

import { AppComponent } from './app.component';
import { GamesApiService } from './services/games-api.service';
import { BoardCellComponent } from './games/oka/board-cell/board-cell.component';
import { CellImagePipe } from './games/oka/cell-image.pipe';
import { BoardCornerCellComponent } from './games/oka/board-corner-cell/board-corner-cell.component';
import { BoardComponent } from './games/oka/board/board.component';
import { OkaGameApiService } from './games/oka/oka-game-api.service';
import { DiceComponent } from './games/oka/dice/dice.component';
import { PlayerInfoComponent } from './games/oka/player-info/player-info.component';
import { CellDetailComponent } from './games/oka/cell-detail/cell-detail.component';
import { WinnerComponent } from './games/oka/winner/winner.component';
import { AppRoutingModule } from './/app-routing.module';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './register/register.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { AuthGuard } from './services/auth-guard';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DicesGameComponent } from './games/dices/dices-game.component';
import { ImageDiceComponent } from './games/dices/image-dice/image-dice.component';
import { DicesGameApiService } from './games/dices/dices-game-api.service';
import { DicesTimerComponent } from './games/dices/dices-timer/dices-timer.component';
import { UrlCssPipe } from './pipes/url-pipe';
import { InputComponent } from './input/input.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    BoardCellComponent,
    CellImagePipe,
    BoardCornerCellComponent,
    BoardComponent,
    DiceComponent,
    PlayerInfoComponent,
    CellDetailComponent,
    WinnerComponent,
    StartComponent,
    LoginComponent,
    RegisterComponent,
    UserhomeComponent,
    DicesGameComponent,
    ImageDiceComponent,
    DicesTimerComponent,
    InputComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule, FormsModule,
    BrowserAnimationsModule, ToasterModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard, GamesApiService,
              CellImagePipe, DatePipe,OkaGameApiService,
              DicesGameApiService, UrlCssPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
