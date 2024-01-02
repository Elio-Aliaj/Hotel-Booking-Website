import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(public http: HttpClient, public router: Router) {}

  bookingData(): any {
    return this.http.get<any>('http://localhost:3000/Booking', {
      withCredentials: true,
    });
  }
  roomsData(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/Rooms', {
      withCredentials: true,
    });
  }
  usersData(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/Users', {
      withCredentials: true,
    });
  }
  authData(): any {
    return this.http.get<any>('http://localhost:3000/Auth', {
      withCredentials: true,
    });
  }
  addEdit(formData: any, roomId: number): Observable<any> {
    if (roomId > 0) {
      return this.http.put<any>('http://localhost:3000/editRoom', formData, {
        withCredentials: true,
      });
    } else {
      return this.http.post<any>('http://localhost:3000/addRoom', formData, {
        withCredentials: true,
      });
    }
  }
  editUser(formData: any, username: string): Observable<any> {
    return this.http.put<any>(
      'http://localhost:3000/editUser',
      { formData, username },
      {
        withCredentials: true,
      }
    );
  }
  editBooking(formData: any, booking_id: number): Observable<any> {
    return this.http.put<any>(
      'http://localhost:3000/editBookings',
      { formData, booking_id },
      {
        withCredentials: true,
      }
    );
  }
  deleteRoom(roomId: any): Observable<any> {
    return this.http.delete(`http://localhost:3000/deleteRoom/${roomId}`, {
      withCredentials: true,
    });
  }
  deleteBook(bookID: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/deleteBook/${bookID}`, {
      withCredentials: true,
    });
  }
  deleteUser(userID: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/deleteUser/${userID}`, {
      withCredentials: true,
    });
  }
}
