import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BoardCellComponent } from './board-cell/board-cell.component';
import { CellImagePipe } from './cell-image.pipe';
import { BoardCornerCellComponent } from './board-corner-cell/board-corner-cell.component';
import { BoardComponent } from './board/board.component';
import {GameApiService} from './game-api.service';
import { BoardPlayerComponent } from './board-player/board-player.component';
import { DiceComponent } from './dice/dice.component';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { CellDetailComponent } from './cell-detail/cell-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardCellComponent,
    CellImagePipe,
    BoardCornerCellComponent,
    BoardComponent,
    BoardPlayerComponent,
    DiceComponent,
    PlayerInfoComponent,
    CellDetailComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [CellImagePipe, GameApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
