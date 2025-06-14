
export interface CreateProductData {
  title: string;
  process?: string;
  strengths?: string;
  observations?: string;
  categoryId?: string;
  companyId?: string;
  documents?: File[];
}

export interface UpdateProductData extends CreateProductData {
  id: string;
}
