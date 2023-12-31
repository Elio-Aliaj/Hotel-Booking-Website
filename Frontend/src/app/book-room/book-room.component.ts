import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../sevices/data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrl: './book-room.component.css',
})
export class BookRoomComponent implements OnInit {
  room: any;
  rooms: any;
  auth: any;
  roomId!: number;
  imageWarning: boolean = false;
  notImage: boolean = false;

  public bookForm!: FormGroup;
  public addEditRooms!: FormGroup;
  formData = new FormData();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.params.subscribe((params) => {
      this.roomId = +params['id'];
    });
    this.http
      .get<any>('http://localhost:3000/Rooms', { withCredentials: true })
      .subscribe(
        (res) => {
          this.rooms = res.rooms;
          this.auth = res.auth;
          this.room = this.rooms.find(
            (room: { room_id: number }) => room.room_id == this.roomId
          );

          this.addEditRooms = this.formBuilder.group({
            surface: [
              this.room?.surface,
              [Validators.required, Validators.max(10000)],
            ],
            orientation: [
              this.room?.orientation,
              [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern(/^[a-zA-Z ]+$/),
              ],
            ],
            nightly_price: [
              this.room?.nightly_price,
              [Validators.required, Validators.max(100000)],
            ],
            image: [null, Validators.required],
          });
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
          alert('Booked successfully');
        },
        (err) => {
          console.log(err);
          alert(err.error.message);
        }
      );
  }

  imageSelected(image: any): void {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    image = image.target.files[0];
    if (image.size > 12000000) {
      this.imageWarning = true;
    } else if (!allowedImageTypes.includes(image.type)) {
      this.notImage = true;
      console.log('Image type not allowed');
    } else {
      this.imageWarning = false;
      this.notImage = false;
      this.formData.delete('image');
      this.formData.append('image', image, image.name);
    }
  }
  addEditRoom(): void {
    this.formData.append('roomId', String(this.roomId));
    this.formData.append('surface', this.addEditRooms.get('surface')?.value);
    this.formData.append(
      'orientation',
      this.addEditRooms.get('orientation')?.value
    );
    this.formData.append(
      'nightly_price',
      this.addEditRooms.get('nightly_price')?.value
    );

    this._dataService.addEdit(this.formData, this.roomId).subscribe(
      (result) => {
        alert(result.message);
        this.formData.forEach((value, key) => {
          this.formData.delete(key);
          this.addEditRooms.reset();
          this.router.navigate(['dashBoard/rooms']);
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
