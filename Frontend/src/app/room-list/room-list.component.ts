import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent implements OnInit {
  rooms: any;
  username: any;
  public bookForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.http
      .get<any>('http://localhost:3000/Rooms', { withCredentials: true })
      .subscribe(
        (res) => {
          this.rooms = res.rooms;
          this.username = res.auth.username;
        },
        (error) => {
          console.log('HTTP Error', error);
        }
      );
    this.bookForm = this.formBuilder.group({
      bookDate: [null, Validators.required],
    });
  }
  logOut(): void {
    this.http
      .post(
        'http://localhost:3000/Logout',
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (res) => {
          this.router.navigate(['login']);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  book(id: number) {
    this.router.navigate(['bookRoom', id]);
  }
}
