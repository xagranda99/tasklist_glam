export interface PendingRequest {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

export interface PendingTimeRequest extends PendingRequest {
  taskId: string;
  timeId?: string;
  type: 'create' | 'update' | 'delete';
}
