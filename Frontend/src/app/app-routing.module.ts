import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RoomListComponent } from './room-list/room-list.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { BookRoomComponent } from './book-room/book-room.component';
import { BookingsComponent } from './dash-board/bookings/bookings.component';
import { UsersComponent } from './dash-board/users/users.component';
import { EditFieldComponent } from './dash-board/edit-field/edit-field.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'signup', title: 'Sign Up', component: SignupComponent },
  { path: 'roomList', title: 'Room List', component: RoomListComponent },
  {
    path: 'dashBoard',
    title: 'DashBoard',
    children: [
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
      {
        path: 'rooms',
        title: 'DashBoard | Rooms',
        component: RoomListComponent,
      },
      {
        path: 'bookings',
        title: 'DashBoard | Bookings',
        component: BookingsComponent,
      },
      {
        path: 'users',
        title: 'DashBoard | Users',
        component: UsersComponent,
      },
      {
        path: 'editField/:username',
        title: 'DashBoard | Edit Field',
        component: EditFieldComponent,
      },
    ],
    component: DashBoardComponent,
  },
  { path: 'bookRoom/:id', title: 'Room Booking', component: BookRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
