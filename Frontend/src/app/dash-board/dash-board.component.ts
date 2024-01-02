import { Component, OnInit } from '@angular/core';
import { DataService } from '../sevices/data.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css',
})
export class DashBoardComponent implements OnInit {
  auth: any = {};

  constructor(private _dataService: DataService) {}

  ngOnInit(): void {}
}
