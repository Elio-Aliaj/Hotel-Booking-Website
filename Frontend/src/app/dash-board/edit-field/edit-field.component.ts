import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../sevices/data.service';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.css',
})
export class EditFieldComponent implements OnInit {
  public userForm!: FormGroup;
  users: any;

  user: any;
  username!: any;

  constructor(
    private router: Router,
    private _dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
    });

    this._dataService.usersData().subscribe(
      (res: any) => {
        this.users = res.users;

        this.user = this.users.find(
          (user: { username: number }) => user.username == this.username
        );
        console.log(
          '🚀 ~ file: edit-field.component.ts:40 ~ EditFieldComponent ~ ngOnInit ~ user:',
          this.user
        );
        this.userForm = this.formBuilder.group({
          username: [
            this.user?.username,
            [Validators.required, Validators.max(100)],
          ],
          name: [
            this.user?.name,
            [
              Validators.required,
              Validators.maxLength(100),
              Validators.pattern(/^[a-zA-Z ]+$/),
            ],
          ],
          last: [this.user?.last, [Validators.required, Validators.max(100)]],
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  onSubmit(): void {
    console.log('tese');
  }
}
