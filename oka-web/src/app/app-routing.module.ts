import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './games/oka/board/board.component';
import { StartComponent } from './start/start.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: StartComponent },
  { path: 'games/oka/:id', component: BoardComponent, canActivate: [AuthGuard] },
  { path: 'userhome', component: UserhomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
