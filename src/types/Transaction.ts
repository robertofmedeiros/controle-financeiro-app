export interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  date: string;
  type: "income" | "expense";
  mes: number,
  ano: number,
}