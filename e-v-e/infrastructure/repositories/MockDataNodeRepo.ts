import { DataNode } from '@/core/entities/DataNode';
import { DataNodeRepository } from '@/core/ports/DataNodeRepository';

export class MockDataNodeRepo implements DataNodeRepository {
  async getAllNodes(): Promise<DataNode[]> {
    // Trong thực tế, bạn sẽ query Database hoặc fetch qua network ở đây
    return [
      { id: '1', ipAddress: '192.168.1.1', status: 'active', bandwidth: 100 },
      { id: '2', ipAddress: '192.168.1.2', status: 'offline', bandwidth: 0 },
    ];
  }

  async getNodeStatus(id: string): Promise<'active' | 'offline'> {
    return 'active';
  }
}