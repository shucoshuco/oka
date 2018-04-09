import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';

import { AppComponent } from './app.component';
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
    UserhomeComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, AppRoutingModule, FormsModule,
    BrowserAnimationsModule, ToasterModule.forRoot(),
  ],
  providers: [CellImagePipe, OkaGameApiService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
