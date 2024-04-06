export interface HttpError {
  status: number;
  message: string;
}

export interface OrderItem {
  id: string;
  time_created: number;
  bob_cost: number;
  jeremy_cost: number;
}

export interface DynamoDBParams {
  TableName: string;
  Item: OrderItem;
}

export interface Cost {
  name: string;
  amount: number;
}

export interface Item {
  [key: string]: any;
  id: string;
  time_created: number;
  costs: Array<Cost>;
}

export interface Property {
  key: string;
  type: string;
}
