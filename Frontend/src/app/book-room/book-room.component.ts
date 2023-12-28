import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrl: './book-room.component.css',
})
export class BookRoomComponent implements OnInit {
  room: any;
  rooms: any;
  username: any;
  public bookForm!: FormGroup;
  roomId!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roomId = +params['id'];
    });
    this.http
      .get<any>('http://localhost:3000/Rooms', { withCredentials: true })
      .subscribe(
        (res) => {
          this.rooms = res.rooms;
          this.username = res.auth.username;

          this.room = this.rooms[this.roomId - 1];
        },
        (error) => {
          console.log('HTTP Error', error);
        }
      );

    this.bookForm = this.formBuilder.group({
      bookDate: [null, Validators.required],
      room: this.roomId,
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
  book(): void {
    this.http
      .post('http://localhost:3000/Book', this.bookForm.value, {
        withCredentials: true,
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.bookForm.reset();
          this.router.navigate(['roomList']);
        },
        (err) => {
          console.log(err);
          alert(err.error.message);
        }
      );
  }
}
