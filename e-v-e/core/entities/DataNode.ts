export interface DataNode {
  id: string;
  ipAddress: string;
  status: 'active' | 'offline';
  bandwidth: number;
}