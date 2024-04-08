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
