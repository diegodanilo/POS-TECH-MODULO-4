import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ITransaction } from 'src/app/domain/model/transaction-interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private readonly collectionRef;

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(this.firestore, 'transactions');
  }

  getTransactions$(): Observable<ITransaction[]> {
    const ref = collection(this.firestore, 'transactions');
    return collectionData(ref, { idField: 'id' }) as Observable<ITransaction[]>;
  }

  addTransaction(data: ITransaction): Promise<any> {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    console.log('Formatted Date:', formattedDate);

    return addDoc(this.collectionRef, {
      ...data,
      createdAt: formattedDate
    });
  }

  /** 🔹 Update */
  updateTransaction(id: string, data: Partial<ITransaction>): Promise<void> {
    const ref = doc(this.firestore, `transactions/${id}`);
    return updateDoc(ref, data);
  }

  /** 🔹 Delete */
  deleteTransaction(id: string): Promise<void> {
    const ref = doc(this.firestore, `transactions/${id}`);
    return deleteDoc(ref);
  }

  getTotalBalance$(): Observable<number> {
    return this.getTransactions$().pipe(
      map(transactions =>
        transactions.reduce((total, transaction) => {
          const transactionTotal = transaction.categoria?.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          ) ?? 0;

          return total + transactionTotal;
        }, 0)
      )
    );
  }

  /** 🔹 Soma por mês */
  getMonthlyExpenses$(): Observable<{ month: string; total: number }[]> {
    return this.getTransactions$().pipe(
      map(transactions => {
        const grouped: { [month: string]: number } = {};
        transactions.forEach(t => {
          const date = (t.id as any)?.toDate?.() ?? new Date();
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const total = t.categoria?.reduce((sum, item) => sum + (item.amount || 0), 0) ?? 0;
          grouped[monthKey] = (grouped[monthKey] || 0) + total;
        });
        return Object.entries(grouped).map(([month, total]) => ({ month, total }));
      })
    );
  }

  /** 🔹 Soma por ano */
  getYearlyExpenses$(): Observable<{ year: string; total: number }[]> {
    return this.getTransactions$().pipe(
      map(transactions => {
        const grouped: { [year: string]: number } = {};
        transactions.forEach(t => {
          const date = (t.id as any)?.toDate?.() ?? new Date();
          const yearKey = `${date.getFullYear()}`;
          const total = t.categoria?.reduce((sum, item) => sum + (item.amount || 0), 0) ?? 0;
          grouped[yearKey] = (grouped[yearKey] || 0) + total;
        });
        return Object.entries(grouped).map(([year, total]) => ({ year, total }));
      })
    );
  }
}
