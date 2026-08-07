import { DataNode } from '../entities/DataNode';
import { DataNodeRepository } from '../ports/DataNodeRepository';

export class GetActiveNodesUseCase {
  constructor(private nodeRepository: DataNodeRepository) {}

  async execute(): Promise<DataNode[]> {
    const nodes = await this.nodeRepository.getAllNodes();
    // Logic nghiệp vụ: Chỉ lọc các node đang active và băng thông > 0
    return nodes.filter(node => node.status === 'active' && node.bandwidth > 0);
  }
}