import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRoomComponent } from './book-room.component';

describe('BookRoomComponent', () => {
  let component: BookRoomComponent;
  let fixture: ComponentFixture<BookRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
