import { Component, ChangeDetectionStrategy } from '@angular/core';
import { map } from 'rxjs';
import { TransactionsService } from 'src/app/features/transactions/services/transactions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  transactions$ = this.transactionsService.getTransactions$();

  totalBalance$ = this.transactions$.pipe(
    map(transactions =>
      transactions.reduce((total, t) =>
        total + (t.categoria?.reduce((s, c) => s + (c.amount || 0), 0) ?? 0),
      0)
    )
  );

  totalIncome$ = this.transactions$.pipe(
    map(transactions =>
      transactions.reduce((total, t) =>
        total + (t.categoria?.filter(c => c.amount > 0)
          .reduce((s, c) => s + c.amount, 0) ?? 0),
      0)
    )
  );

  totalExpense$ = this.transactions$.pipe(
    map(transactions =>
      transactions.reduce((total, t) =>
        total + (t.categoria?.filter(c => c.amount < 0)
          .reduce((s, c) => s + Math.abs(c.amount), 0) ?? 0),
      0)
    )
  );

  constructor(private transactionsService: TransactionsService) {}
}
