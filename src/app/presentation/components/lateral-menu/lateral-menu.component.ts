import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { menuItems } from 'src/app/domain/constants/menu-items';
import { IMenu } from 'src/app/domain/model/menu-interface';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.scss']
})
export class LateralMenuComponent {
  public menuItems = menuItems;
  

  constructor(private auth: AuthService, private router: Router) {}

    async onMenuClick(item: IMenu) {
    if (item.label === 'Logoff') {
      console.log('Logging out...');
      await this.auth.logout();   // encerra sessão no Firebase
      this.router.navigate(['/login']); // redireciona
    } else if (item.path) {
      this.router.navigate([item.path]);
    }
  }

}
