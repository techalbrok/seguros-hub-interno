
export interface News {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
  };
  companies?: Array<{
    id: string;
    name: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  products?: Array<{
    id: string;
    title: string;
  }>;
}

export interface CreateNewsData {
  title: string;
  content: string;
  featured_image?: string;
  published: boolean;
  company_ids?: string[];
  category_ids?: string[];
  product_ids?: string[];
}
