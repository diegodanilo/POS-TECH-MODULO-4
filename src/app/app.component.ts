import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { checkScreenSize, ScreenType } from 'src/utils/check-screen-size';
import { IUser } from 'src/app/domain/model/user-interface';
import { UserDataHandler } from 'src/utils/store-user-data';
import { UsersService } from './features/users/services/users.service';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-component-wrapper',
  template: `
    <nz-content>
      <router-outlet></router-outlet>
    </nz-content>
  `,
  standalone: true,
  imports: [NzLayoutModule, RouterModule]
})
export class ContentWrapperComponent {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostListener('window:resize', ['$event']) onWindowResize() {
    this.screenType = checkScreenSize(window.innerWidth);
  }
  public screenType: ScreenType = 'desktop';
  private userData!: IUser;
  private userHandler?: UserDataHandler;
  isAuthPage: boolean = false


  constructor(private router: Router) {
    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.isAuthPage = ['/login', '/signup', '/forgot-password'].includes(event.urlAfterRedirects);
    }
  });

    this.getUserData();
  }

  title = 'projeto';

  ngOnInit(): void {
    this.screenType = checkScreenSize(window.innerWidth);
  }

  private getUserData(): void {
    // this.userService.getUser().subscribe((element) => {
    //   this.userData = element;
    //   this.userHandler = new UserDataHandler(this.userData);
    //   this.userHandler.storeData();
    // })
  }
}
