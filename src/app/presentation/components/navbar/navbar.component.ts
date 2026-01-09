import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ScreenType } from 'src/utils/check-screen-size';
import { menuItems } from 'src/app/domain/constants/menu-items';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() screenType: ScreenType = 'desktop';
  isCollapsed: boolean = false;
  windowWidth: number = 0;
  public menuItems = menuItems;
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
  }

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public navigate(path: string): void {
    this.router.navigate([path]);
  }
}
