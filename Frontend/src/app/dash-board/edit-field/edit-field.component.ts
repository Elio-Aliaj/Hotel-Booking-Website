import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../sevices/data.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.css',
})
export class EditFieldComponent implements OnInit {
  users: any;
  user: any;
  bookings: any;
  booking: any;
  rooms: any;
  room: any;
  username!: any;
  booking_id!: any;
  editBookingStatus: Boolean = false;

  public userForm!: FormGroup;
  public bookingForm!: FormGroup;

  constructor(
    private router: Router,
    private _dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = +params['username'];
      if (Number.isNaN(this.username)) {
        this.username = params['username'];
        this.editBookingStatus = false;
      } else {
        this.editBookingStatus = true;
      }
    });

    if (this.editBookingStatus == true) {
      this.bookingForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        room: ['', [Validators.required]],
        date: ['', [Validators.required]],
      });

      this._dataService.bookingData().subscribe(
        (data: any) => {
          this.bookings = data.bookings;
          this.booking = this.bookings.find(
            (book: { booking_id: number }) => book.booking_id == this.username
          );

          this._dataService.usersData().subscribe(
            (res) => {
              this.users = res.users;
              this.bookingForm.patchValue({
                username: this.booking?.username,
              });
            },
            (err) => {
              console.log(err);
            }
          );

          this._dataService.roomsData().subscribe(
            (res) => {
              this.rooms = res.rooms;
              this.bookingForm.patchValue({
                room: this.booking?.room_id,
              });
            },
            (err) => {
              console.log(err);
            }
          );
          this.bookingForm.patchValue({
            date: this.formatDateForInput(this.booking?.reservation_date),
          });
        },
        (err: any) => {
          console.error(err);
        }
      );
    } else {
      this.userForm = this.formBuilder.group({
        username: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z ]+$/),
          ],
        ],
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z ]+$/),
          ],
        ],
        last: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z ]+$/),
          ],
        ],
        role: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z ]+$/),
          ],
        ],
      });

      this._dataService.usersData().subscribe(
        (res) => {
          this.users = res.users;
          this.user = this.users.find(
            (user: { username: string }) => user.username == this.username
          );
          this.userForm.patchValue({
            username: this.user?.username,
            name: this.user?.name,
            last: this.user?.last,
            role: this.user?.role,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  editUser(): void {
    this._dataService.editUser(this.userForm.value, this.username).subscribe(
      (res) => {
        alert(res.message);
        this.userForm.reset();
        this.router.navigate(['dashBoard/users']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  editBooking(): void {
    this._dataService
      .editBooking(this.bookingForm.value, this.booking.booking_id)
      .subscribe(
        (res) => {
          alert(res.message);
          this.bookingForm.reset();
          this.router.navigate(['dashBoard/bookings']);
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }
  formatDateForInput(dateString: string | undefined): string {
    if (!dateString) {
      return '';
    }

    const formattedDate = formatDate(dateString, 'yyyy-MM-dd', 'en-US');
    return formattedDate;
  }
}
