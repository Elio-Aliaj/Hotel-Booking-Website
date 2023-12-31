import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { BookRoomComponent } from './book-room/book-room.component';
import { BookingsComponent } from './dash-board/bookings/bookings.component';
import { UsersComponent } from './dash-board/users/users.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { EditFieldComponent } from './dash-board/edit-field/edit-field.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    DashBoardComponent,
    RoomListComponent,
    DashBoardComponent,
    BookRoomComponent,
    BookingsComponent,
    UsersComponent,
    NavBarComponent,
    EditFieldComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
