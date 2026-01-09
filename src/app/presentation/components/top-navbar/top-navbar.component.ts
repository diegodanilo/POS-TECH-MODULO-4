import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserSessionService } from 'src/app/features/users/services/user-session.service';
import { UserDataHandler } from 'src/utils/store-user-data';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  userName: string = '';
  userHandler?: UserDataHandler;
   isAuthenticated$ = this.authService.isAuthenticated$;
   user$ = this.userSession.userProfile$;


  constructor(private authService: AuthService, private userSession: UserSessionService) {
    this.userHandler = new UserDataHandler();
    this.userName = this.userHandler.getUserName() ?? '';
  }

  ngOnInit(): void {}
}
