/**
 * ENTITY: Category
 *
 * Khớp với schema Firestore collection "categories"
 * Fields từ Firestore Console: createdAt, description, id, name, parentId
 */

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;  // null = category gốc, có value = subcategory
  createdAt: Date;
}
