import { DataNode } from '../entities/DataNode';

export interface DataNodeRepository {
  getAllNodes(): Promise<DataNode[]>;
  getNodeStatus(id: string): Promise<'active' | 'offline'>;
}