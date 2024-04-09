export interface HttpError {
  status: number;
  message: string;
}

export interface Cost {
  name: string;
  amount: number;
}
export interface OrderData {
  id: string;
  time_created: number;
  costs: Array<Cost>;
  who_paid: string;
}

export interface Item extends OrderData {
  [key: string]: any;
}

export interface Property {
  key: string;
  type: string;
}

export interface CostMap {
  [key: string]: Array<number>;
}

export interface TotalMap {
  [key: string]: number;
}

export interface DifferenceMap {
  [key: string]: number;
}

export interface SpendMap {
  [key: string]: number;
}

export interface Difference {
  name: string;
  amount: number;
}
