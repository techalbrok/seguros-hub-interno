
export interface DepartmentContent {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  department_id: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  departments?: {
    id: string;
    name: string;
  };
  profiles?: {
    id: string;
    name: string;
  };
}

export interface CreateDepartmentContentData {
  title: string;
  content: string;
  department_id: string;
  featured_image?: string;
  published?: boolean;
}
