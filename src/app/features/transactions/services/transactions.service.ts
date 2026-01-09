import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable, map, of, switchMap } from 'rxjs';
import { ITransaction } from 'src/app/domain/model/transaction-interface';
import { AuthService } from 'src/app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  /** 🔹 BUSCA SOMENTE TRANSAÇÕES DO USUÁRIO LOGADO */
  getTransactions$(): Observable<ITransaction[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);

        const ref = query(
          collection(this.firestore, 'transactions'),
          where('userId', '==', user.uid)
        );
        return collectionData(ref, { idField: 'id' }) as Observable<ITransaction[]>;
      })
    );
  }

  /** 🔹 CREATE */
  addTransaction(data: ITransaction): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const ref = collection(this.firestore, 'transactions');

    return addDoc(ref, {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp()
    }).then(() => undefined);
  }

  /** 🔹 UPDATE */
  updateTransaction(id: string, data: Partial<ITransaction>): Promise<void> {
    const ref = doc(this.firestore, `transactions/${id}`);
    return updateDoc(ref, data);
  }

  /** 🔹 DELETE */
  deleteTransaction(id: string): Promise<void> {
    const ref = doc(this.firestore, `transactions/${id}`);
    return deleteDoc(ref);
  }

  /** 🔹 TOTAL */
  getTotalBalance$(): Observable<number> {
    return this.getTransactions$().pipe(
      map(transactions =>
        transactions.reduce((total, transaction) => {
          const sum =
            transaction.categoria?.reduce(
              (acc, item) => acc + (item.amount || 0),
              0
            ) ?? 0;
          return total + sum;
        }, 0)
      )
    );
  }

  /** 🔹 POR MÊS */
  getMonthlyExpenses$(): Observable<{ month: string; total: number }[]> {
    return this.getTransactions$().pipe(
      map(transactions => {
        const grouped: Record<string, number> = {};

        transactions.forEach(t => {
          const month = t.month;
          const total =
            t.categoria?.reduce((sum, item) => sum + (item.amount || 0), 0) ?? 0;

          grouped[month] = (grouped[month] || 0) + total;
        });

        return Object.entries(grouped).map(([month, total]) => ({ month, total }));
      })
    );
  }
 }



