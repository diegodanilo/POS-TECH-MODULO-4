// import { Component, HostListener, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';

// interface Transaction {
//   id?: number;
//   month: string;
//   categoria: [
//     {
//       id: number;
//       description: string;
//       date: Date;
//       type: 'income' | 'expense';
//       amount: number;
//     }
//   ]
// }

// @Component({
//   selector: 'app-new-transaction-card',
//   templateUrl: './new-transaction-card.component.html',
//   styleUrls: ['./new-transaction-card.component.scss'],
// })
// export class NewTransactionCardComponent {
//   selectedType: string = '';
//   selectedOption: string = '';
//   isDropdownOpen: boolean = false;
//   value: number = 0;
//   formattedValue: string = '';
//   isFocused: boolean = false;

//   constructor(private fb: FormBuilder) {}

//   onValueChange(event: any) {
//     let value = event.target.value;
//     value = value.replace(/\D/g, '');
//     const numericValue = parseInt(value) || 0;
//     this.value = numericValue / 100;
//     this.formattedValue = this.formatCurrency(numericValue);
//   }

//   onFocus() {
//     this.isFocused = true;
//     if (this.formattedValue === '' || this.formattedValue === '0,00') {
//       this.formattedValue = '';
//     }
//   }

//   onBlur() {
//     this.isFocused = false;
//     if (this.formattedValue === '') {
//       this.formattedValue = '0,00';
//     }
//   }

//   formatCurrency(value: number): string {
//     const reais = value / 100;
//     return reais.toLocaleString('pt-BR', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });
//   }

//   addTransaction() {
//     if (!this.isTransactionValid()) return;

//     const now = new Date();
//     const month = this.getCurrentMonth(now);

//     // this.transactionService.getTransactions().subscribe(transactions => {
//     //   const existingTransaction = transactions.find(t => t.month === month);
//     //   const newCategoria = this.createCategoria(now);

//     //   if (existingTransaction) {
//     //     this.addCategoriaToExistingTransaction(existingTransaction, newCategoria);
//     //   } else {
//     //     this.createNewTransaction(month, newCategoria);
//     //   }
//     // });
//   }


//   private isTransactionValid(): boolean {
//     return !!this.selectedType && !!this.selectedOption && this.value > 0;
//   }

//   private getCurrentMonth(date: Date): string {
//     return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
//   }

//   private createCategoria(date: Date) {
//     return {
//       id: Date.now(),
//       description: this.selectedOption,
//       date: date,
//       type: this.selectedType as 'income' | 'expense',
//       amount: this.selectedType === 'income'
//         ? Math.abs(this.value)
//         : -Math.abs(this.value)
//     };
//   }

//   private addCategoriaToExistingTransaction(transaction: any, categoria: any) {
//     transaction.categoria.push(categoria);
//     // this.transactionService.updateTransaction(transaction.id, transaction).subscribe(() => {
//     //   this.resetForm();
//     // });
//   }

//   private createNewTransaction(month: string, categoria: any) {
//     const transaction = {
//       month: month,
//       categoria: [categoria]
//     };
//     // this.transactionService.addTransaction(transaction).subscribe(() => {
//     //   this.resetForm();
//     // });
//   }

//   private resetForm() {
//     this.selectedType = "";
//     this.selectedOption = "";
//     this.value = 0;
//     this.formattedValue = '';
//   }

//   toggleDropdown() {
//     this.isDropdownOpen = !this.isDropdownOpen;
//   }

//   selectOption(value: string, text: string, event: Event) {
//     event.stopPropagation();
//     this.selectedType = value;
//     this.selectedOption = text;
//     this.isDropdownOpen = false;
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: Event) {
//     const target = event.target as HTMLElement;
//     const selectWrapper = target.closest('.custom-select-wrapper');

//     if (!selectWrapper && this.isDropdownOpen) {
//       this.isDropdownOpen = false;
//     }
//   }
// }




import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TransactionsService } from 'src/app/features/transactions/services/transactions.service';
import { Categoria, ITransaction } from 'src/app/domain/model/transaction-interface';
import { v4 as uuidv4 } from 'uuid';
import { take } from 'rxjs';

@Component({
  selector: 'app-new-transaction-card',
  templateUrl: './new-transaction-card.component.html',
  styleUrls: ['./new-transaction-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class NewTransactionCardComponent {
  selectedType: string = '';
  selectedOption: string = '';
  isDropdownOpen: boolean = false;
  value: number = 0;
  formattedValue: string = '';
  isFocused: boolean = false;
  fileList!: NzUploadFile[];
  mensagemErro: string = '';
  receiptFile: File | null = null;
  receiptPreviewUrl: string | null = null;
  receiptName: string = '';
  isImage: boolean = false;
  isPDF: boolean = false;
  receiptBlobUrl: string | null = null;

  constructor( private transactionsService: TransactionsService,) { }

  onValueChange(event: any) {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    const numericValue = parseInt(value) || 0;
    this.value = numericValue / 100;
    this.formattedValue = this.formatCurrency(numericValue);
  }

  onFocus() {
    this.isFocused = true;
    if (this.formattedValue === '' || this.formattedValue === '0,00') {
      this.formattedValue = '';
    }
  }

  onBlur() {
    this.isFocused = false;
    if (this.formattedValue === '') {
      this.formattedValue = '0,00';
    }
  }

  formatCurrency(value: number): string {
    const reais = value / 100;
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  addTransaction(): void {
    if (!this.isTransactionValid()) return;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; 
    console.log('Data atual:', formattedDate);
    const month = this.getCurrentMonth(now);
    try {
    this.transactionsService.getTransactions$()
  .pipe(take(1))
  .subscribe(transactions => {
    const existingTransaction = transactions.find((t: ITransaction) => t.month === month);
    const newCategoria = this.createCategoria(now);
    console.log('Nova categoria criada:', newCategoria);

    if (existingTransaction) {
      this.addCategoriaToExistingTransaction(existingTransaction, newCategoria);
    } else {
      this.createNewTransaction(month, newCategoria);
    }
  });
    } catch (err) {
    this.mensagemErro = 'Erro ao adicionar transação.';
    console.error('Erro ao adicionar transação:', err);
  }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.receiptFile = file;
      this.receiptName = file.name;
      const fileType = file.type;
      const blobUrl = URL.createObjectURL(file);
      this.receiptBlobUrl = blobUrl;
      this.isImage = fileType.startsWith('image/');
      this.isPDF = fileType === 'application/pdf';
      const reader = new FileReader();

      reader.onload = () => {
        this.receiptPreviewUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  abrirRecibo(): void {
    if (this.receiptBlobUrl) {
      window.open(this.receiptBlobUrl, '_blank');
    }
  }

  private isTransactionValid(): boolean {
    return !!this.selectedType && !!this.selectedOption && this.value > 0;
  }

  private getCurrentMonth(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
  }

  private createCategoria(date: Date) {
    return {
      id: uuidv4(),
      description: this.selectedOption,
      date: date.toISOString().split('T')[0],
      type: this.selectedType as 'income' | 'expense',
      amount: this.selectedType === 'emprestimo'
        ? Math.abs(this.value)
        : -Math.abs(this.value)
    };
  }

 private async addCategoriaToExistingTransaction(transaction: ITransaction, categoria: Categoria): Promise<void> {
  try {
    transaction.categoria.push(categoria);

    await this.transactionsService.updateTransaction(transaction.id, transaction);
    this.resetForm();
    await this.transactionsService.getTransactions$();
    console.log('Categoria adicionada com sucesso');
  } catch (err) {
    this.mensagemErro = 'Erro ao adicionar categoria.';
    console.error('Erro ao atualizar transação:', err);
  }
}


private async createNewTransaction(month: string, categoria: Categoria): Promise<void> {
  const transaction: ITransaction = {
    id: uuidv4(),   
    month,
    categoria: [categoria]
  };

  try {
    await this.transactionsService.addTransaction(transaction);
    this.resetForm();
    await this.transactionsService.getTransactions$(); 
    console.log('Transação criada com sucesso');
  } catch (err) {
    this.mensagemErro = 'Erro ao criar transação.';
    console.error('Erro ao salvar transação:', err);
  }
}


  private resetForm() {
    this.selectedType = "";
    this.selectedOption = "";
    this.value = 0;
    this.formattedValue = '';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(value: string, text: string, event: Event) {
    event.stopPropagation();
    this.selectedType = value;
    this.selectedOption = text;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const selectWrapper = target.closest('.custom-select-wrapper');

    if (!selectWrapper && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}