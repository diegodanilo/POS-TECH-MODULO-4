import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, shareReplay, Subject, Subscription } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Categoria, ITransaction } from 'src/app/domain/model/transaction-interface';
import { TransactionsService } from 'src/app/features/transactions/services/transactions.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    NzSelectModule,
    NzDatePickerModule,
    OverlayModule,
    NzIconModule,
    NzButtonModule
  ]
})

export class ExtratoComponent implements OnInit, OnDestroy {
  transactions: ITransaction[] = [];
  transactions$ = this.transactionService.getTransactions$().pipe(
    shareReplay(1));

  items: string[] = [];
  showEditModal = false;
  mensagemErro = '';
  editForm!: FormGroup;
  editingTransaction: { transactionId: string, categoriaId: string } | null = null;


  private filtersSubject = new BehaviorSubject<{ date: string; type: string }>({ date: '', type: '' });
  private transactionsSubscription!: Subscription;
  private searchSubject = new Subject<string>();

  filters$ = this.filtersSubject.asObservable();
  filteredTransactions$ = combineLatest([
    this.transactions$,
    this.filters$]).pipe(map(([transactions, filters]) =>
      this.applyFilters(transactions, filters)
    ));

  filters = {
    date: '',
    type: ''
  };

  constructor(
    private transactionService: TransactionsService,
    private fb: FormBuilder) {

    this.editForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      amount: [null, Validators.required],
      date: ['', Validators.required],
      month: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadTransactions();
    this.editDescription();
    this.items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  }


  ngOnDestroy(): void {
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  trackByCategoriaId(index: number, item: Categoria) {
    return item.id;
  }

  applyFilters(transactions: ITransaction[], filters: { date: string; type: string }): ITransaction[] {
    const filterDate = filters.date ? new Date(filters.date).toISOString().slice(0, 10) : null;
    const filterType = filters.type;

    return transactions
      .map(t => ({
        ...t,
        categoria: t.categoria.filter(c => {
          const matchesDate = filterDate ? c.date === filterDate : true;
          const matchesType = filterType ? c.type === filterType : true;
          return matchesDate && matchesType;
        })
      }))
      .filter(t => t.categoria.length > 0);
  }

  updateFilters(partial: Partial<{ date: string; type: string }>) {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...partial
    });
  }

  onApplyFilters(): void {
    this.filtersSubject.next({ ...this.filtersSubject.value });
  }

  clearFilters() {
    this.filtersSubject.next({ date: '', type: '' });
  }

  loadTransactions(): void {
    this.transactionsSubscription = this.transactionService.getTransactions$().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filtersSubject.next(this.filtersSubject.value);
        this.mensagemErro = '';
        console.log('ExtratoComponent initialized', this.transactions);
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
        this.mensagemErro = 'Erro ao carregar as transações. Tente novamente mais tarde.';
      },
      complete: () => {
        console.log('Requisição de transações finalizada.');
      }
    });
  }

  openEditModal(transactionId: string, categoria: Categoria, month: string): void {
    this.editingTransaction = { transactionId, categoriaId: categoria.id };
    this.editForm.patchValue({
      description: categoria.description,
      type: categoria.type,
      amount: categoria.amount,
      date: categoria.date,
      month: month
    });
    this.showEditModal = true;
  }

  editDescription(): void {
    this.editForm.get('type')?.valueChanges.subscribe(value => {
      const descriptionsMap: { [key: string]: string } = {
        income: 'Depósito',
        expense: 'Despesa',
        transfer: 'Transferência'
      };
      this.editForm.patchValue({
        description: descriptionsMap[value] || ''
      });
    });
  }

  closeEditModal(): void {
    this.editForm.reset();
    this.editForm.get('description')?.enable();
    this.showEditModal = false;
    this.editingTransaction = null;
  }

  saveEdit(): void {
    this.editForm.get('description')?.enable();
    if (this.editForm.valid && this.editingTransaction) {
      const { transactionId, categoriaId } = this.editingTransaction;
      const transaction = this.getTransactionById(transactionId);
      if (transaction) {
        const categoria = this.getCategoriaById(transaction, categoriaId);
        if (categoria) {
          this.updateCategoriaFromForm(categoria);
          this.updateTransactionMonthFromForm(transaction);
          this.persistTransaction(transactionId, transaction);
        }
      }
      this.closeEditModal();
    }
  }

  public formatCurrencyBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  public formatDateBR(dateInput: string | number | String): string {
    const date = new Date(dateInput.toString());
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  private getTransactionById(transactionId: string): ITransaction | undefined {
    return this.transactions.find(t => t.id === transactionId);
  }

  private getCategoriaById(transaction: ITransaction, categoriaId: string): Categoria | undefined {
    return transaction.categoria.find(c => c.id === categoriaId);
  }

  private updateCategoriaFromForm(categoria: Categoria): void {
    categoria.description = this.editForm.value.description;
    categoria.type = this.editForm.value.type;
    categoria.amount = this.editForm.value.type === 'income'
      ? Math.abs(this.editForm.value.amount)
      : -Math.abs(this.editForm.value.amount);
    categoria.date = this.editForm.value.date;
  }

  private updateTransactionMonthFromForm(transaction: ITransaction): void {
    transaction.month = this.editForm.value.month;
  }

  private async persistTransaction(transactionId: string, transaction: ITransaction): Promise<void> {
    try {
      await this.transactionService.updateTransaction(transactionId, transaction);
      this.loadTransactions();
      await this.transactionService.getTotalBalance$();
      this.mensagemErro = '';
      console.log('Transação atualizada com sucesso');
    } catch (err) {
      this.mensagemErro = 'Erro ao salvar alterações.';
      console.error('Erro ao atualizar:', err);
    }
  }

  async deleteCategoria(transactionId: string, categoriaId: string): Promise<void> {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    transaction.categoria = transaction.categoria.filter(c => c.id !== categoriaId);

    try {
      await this.transactionService.updateTransaction(transactionId, transaction);
      await this.transactionService.getTotalBalance$();
      this.loadTransactions();
      console.log('Categoria deletada com sucesso');
    } catch (err) {
      this.mensagemErro = 'Erro ao deletar categoria.';
      console.error('Erro ao atualizar:', err);
    }
  }
}
