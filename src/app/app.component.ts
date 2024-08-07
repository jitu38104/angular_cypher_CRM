import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private utils: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utils.hasUserLoggedIn();
  }
}
