import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-block',
  templateUrl: './dashboard-block.component.html',
  styleUrls: ['./dashboard-block.component.scss']
})
export class DashboardBlockComponent implements OnInit {
  @Input()
  iconName: string;
  @Input()
  mainText: string;
  @Input()
  secondaryText: string;

  constructor() {}

  ngOnInit() {}
}
