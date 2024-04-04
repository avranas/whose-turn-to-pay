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
