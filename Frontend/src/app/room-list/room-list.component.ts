import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../sevices/data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent implements OnInit {
  rooms: any;
  username: any = {};
  auth: any;
  public bookForm!: FormGroup;
  image: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  public getSanitizedImage(imageString: any): SafeUrl {
    const defaultImageUrl = `https://2.bp.blogspot.com/-OQ8mHKhOI0s/VNJ8Ikp_--I/AAAAAAAAASE/SblsDWPAo3w/s1600/null.jpg`;
    const imageSrc = imageString
      ? `data:image/jpeg;base64,${imageString}`
      : defaultImageUrl;
    return this.sanitizer.bypassSecurityTrustUrl(imageSrc);
  }

  ngOnInit(): void {
    this._dataService.roomsData().subscribe(
      (res: any) => {
        this.rooms = res.rooms;
        this.auth = res.auth;
      },
      (err: any) => {
        console.log(err);
      }
    );
    this.bookForm = this.formBuilder.group({
      bookDate: [null, Validators.required],
    });
  }

  book(roomId: number) {
    this.router.navigate(['bookRoom', roomId]);
  }
  addRoom() {
    this.router.navigate(['bookRoom', -1]); 
  }

  deleteRoomCard(roomId: any, i: number) {
    if (confirm('Are you sure you want to delete? ⚠️')) {
      this._dataService.deleteRoom(roomId).subscribe(
        (response) => {
          alert(response.message);
          this.rooms.splice(i, 1);
        },
        (error) => console.error('Error deleting room', error)
      );
    } else {
      alert('Canceled');
    }
  }
}
