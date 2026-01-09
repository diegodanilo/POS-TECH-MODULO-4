import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { TransactionsService } from "src/app/features/transactions/services/transactions.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalBalance!: Observable<number>;
  income!: Observable<number>;
  expenses!: Observable<number>;
  dashboardVisible = false;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.totalBalance = this.transactionsService.getTotalBalance$();
    // this.income = this.transactionsService.getIncome$();
    // this.expenses = this.transactionsService.getExpenses$();
  }

  openDashboard() {
    this.dashboardVisible = true;
  }

  closeDashboard() {
    this.dashboardVisible = false;
  }
}
