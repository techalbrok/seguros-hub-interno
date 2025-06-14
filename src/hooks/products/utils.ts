
import type { Product } from "@/types";

// Transform database row to Product interface
export const transformDbRowToProduct = (row: any): Product => ({
  id: row.id,
  title: row.title,
  process: row.process || "",
  strengths: row.strengths || "",
  observations: row.observations || "",
  categoryId: row.category_id || "",
  companyId: row.company_id,
  documents: row.product_documents || [],
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});
