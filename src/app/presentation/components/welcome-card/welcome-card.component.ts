import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { IUser } from 'src/app/domain/model/user-interface';
import { TransactionsService } from 'src/app/features/transactions/services/transactions.service';
import { UsersService } from 'src/app/features/users/services/users.service';
import { Chart, registerables } from 'chart.js';

import { UserDataHandler } from 'src/utils/store-user-data';
import { UserSessionService } from 'src/app/features/users/services/user-session.service';

@Component({
  selector: 'app-welcome-card',
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.scss']
})
export class WelcomeCardComponent implements OnInit {
  todayDate: Date = new Date();
  showAmmount: boolean = false;
  userData: IUser | null = null;
  userHandler?: UserDataHandler;
  totalAmmount: any;
  users: IUser[] = [];
  dashboardVisible = false;
  userName$ = this.authService.userName$;
  user$ = this.userSession.userProfile$;
  
  constructor(
    private authService: AuthService,
    private transactionsService: TransactionsService,
    private userSession: UserSessionService) 
    { 
    this.userHandler = new UserDataHandler();
    this.userData = this.userHandler.getUserStored() ?? null;
  }

  ngOnInit(): void {
    this.balanceFormatted();
  }

  balanceFormatted() {
    this.transactionsService.getTotalBalance$().subscribe(balance => {
      this.totalAmmount = balance;
      console.log('Saldo total:', this.totalAmmount);
    });
  }

  public formatCurrencyBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  hideAmmount() {
    this.showAmmount = !this.showAmmount;
  }

}
