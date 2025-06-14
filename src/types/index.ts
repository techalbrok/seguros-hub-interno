
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  delegationId?: string;
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Delegation {
  id: string;
  name: string;
  legalName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  contactPerson: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  commercialWebsite?: string;
  brokerAccess: string;
  commercialManager: string;
  managerEmail: string;
  specifications?: CompanySpecification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySpecification {
  id: string;
  companyId: string;
  category: string;
  content: string;
  order?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  children?: ProductCategory[];
  documents?: CategoryDocument[];
}

export interface CategoryDocument {
  id: string;
  categoryId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  process: string;
  strengths: string;
  observations: string;
  categoryId: string;
  companyId?: string;
  documents: ProductDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDocument {
  id: string;
  productId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface DepartmentContent {
  id: string;
  title: string;
  content: string;
  department: string;
  featuredImage?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  companyIds?: string[];
  categoryIds?: string[];
  productIds?: string[];
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeMode {
  mode: 'light' | 'dark';
}
