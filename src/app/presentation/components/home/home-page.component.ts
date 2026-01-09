import { Component, HostListener, OnInit } from '@angular/core';
import { checkScreenSize, ScreenType } from 'src/utils/check-screen-size';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  @HostListener('window:resize', ['$event']) onWindowResize() {
    this.screenType = checkScreenSize(window.innerWidth);
  }

  public screenType: ScreenType = 'desktop';

  ngOnInit(): void {
    this.screenType = checkScreenSize(window.innerWidth);
  }

}
