export interface Categoria {
  id: string;
  description: string;
  date: String;
  type: 'income' | 'expense';
  amount: number;
  month?: string;
}

export interface ITransaction {
  id: string;
  month: string;
  categoria: Categoria[]; 
}
