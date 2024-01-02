import { Component, OnInit } from '@angular/core';
import { DataService } from '../../sevices/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
})
export class BookingsComponent implements OnInit {
  bookings: any;

  constructor(private _dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this._dataService.bookingData().subscribe(
      (res: any) => {
        this.bookings = res.bookings;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteBooking(id: number, i: number) {
    if (confirm('Are you sure you want to delete? ⚠️')) {
      this._dataService.deleteBook(id).subscribe(
        (res: any) => {
          this.bookings.splice(i, 1);
          alert(res.message);
        },
        (error) => console.error('Error deleting room', error)
      );
    } else {
      alert('Canceled');
    }
  }
  editBooking(booking_id: number): void {
    this.router.navigate(['dashBoard/editField', booking_id]);
  }
}
