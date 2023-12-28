import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RoomListComponent } from './room-list/room-list.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { BookRoomComponent } from './book-room/book-room.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'roomList', component: RoomListComponent },
  { path: 'dashBoard', component: DashBoardComponent },
  { path: 'bookRoom/:id', component: BookRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
