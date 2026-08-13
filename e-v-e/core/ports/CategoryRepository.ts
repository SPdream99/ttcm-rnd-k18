/**
 * PORT: CategoryRepository
 */

import { Category } from '../entities/Category';

export interface CategoryRepository {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  saveCategory(category: Category): Promise<void>;
}
