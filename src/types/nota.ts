export interface Nota {
  id?: string;
  status?: string;
  produtos?: ItemNota[];
}

export interface ItemNota {
  id?: string;
  produtoId?: string;
  quantidade?: number;
}
