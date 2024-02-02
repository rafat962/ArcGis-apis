import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css'],
  animations: [
    trigger('divState', [
      state(
        'normal',
        style({
          opacity: 0,
        })
      ),
      state(
        'neww',
        style({
          opacity: 1,
        })
      ),
      transition('normal <=> neww', animate(500)),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  constructor() {}
  statee = 'normal';

  ngOnInit() {
    setTimeout(() => {
      this.statee = 'neww';
    }, 200);
  }
}
