export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brokerage_config: {
        Row: {
          accent_color_dark: string
          accent_color_light: string
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          primary_color_dark: string
          primary_color_light: string
          updated_at: string
        }
        Insert: {
          accent_color_dark?: string
          accent_color_light?: string
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color_dark?: string
          primary_color_light?: string
          updated_at?: string
        }
        Update: {
          accent_color_dark?: string
          accent_color_light?: string
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color_dark?: string
          primary_color_light?: string
          updated_at?: string
        }
        Relationships: []
      }
      category_documents: {
        Row: {
          category_id: string | null
          id: string
          name: string
          size: number
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          category_id?: string | null
          id?: string
          name: string
          size: number
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          category_id?: string | null
          id?: string
          name?: string
          size?: number
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          broker_access: string
          commercial_manager: string
          commercial_website: string | null
          created_at: string
          id: string
          manager_email: string
          name: string
          updated_at: string
        }
        Insert: {
          broker_access: string
          commercial_manager: string
          commercial_website?: string | null
          created_at?: string
          id?: string
          manager_email: string
          name: string
          updated_at?: string
        }
        Update: {
          broker_access?: string
          commercial_manager?: string
          commercial_website?: string | null
          created_at?: string
          id?: string
          manager_email?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_specifications: {
        Row: {
          category_id: string | null
          company_id: string
          content: string
          created_at: string
          id: string
          order_position: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          company_id: string
          content: string
          created_at?: string
          id?: string
          order_position?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          order_position?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_specifications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "specification_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_specifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      delegations: {
        Row: {
          address: string
          contact_person: string
          created_at: string
          email: string
          id: string
          legal_name: string
          name: string
          phone: string
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          contact_person: string
          created_at?: string
          email: string
          id?: string
          legal_name: string
          name: string
          phone: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          legal_name?: string
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delegations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_content: {
        Row: {
          author_id: string
          content: string
          created_at: string
          department_id: string
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          department_id: string
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          department_id?: string
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_content_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          responsible_email: string | null
          responsible_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          responsible_email?: string | null
          responsible_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          responsible_email?: string | null
          responsible_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      navigation_shortcuts: {
        Row: {
          active: boolean | null
          created_at: string | null
          icon: string | null
          id: string
          order_position: number | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          icon?: string | null
          id?: string
          order_position?: number | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          icon?: string | null
          id?: string
          order_position?: number | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string
          content: string
          created_at: string
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          news_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          news_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          news_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_categories_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_companies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          news_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          news_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          news_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_companies_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_products: {
        Row: {
          created_at: string
          id: string
          news_id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          news_id: string
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          news_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_products_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          level: number
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_documents: {
        Row: {
          id: string
          name: string
          product_id: string | null
          size: number
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          id?: string
          name: string
          product_id?: string | null
          size: number
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          id?: string
          name?: string
          product_id?: string | null
          size?: number
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          company_id: string | null
          created_at: string
          id: string
          observations: string | null
          process: string | null
          strengths: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          observations?: string | null
          process?: string | null
          strengths?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          observations?: string | null
          process?: string | null
          strengths?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          delegation_id: string | null
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delegation_id?: string | null
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delegation_id?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_delegation_id_fkey"
            columns: ["delegation_id"]
            isOneToOne: false
            referencedRelation: "delegations"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_categories: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          order_position: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          order_position?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          order_position?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "specification_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          created_at: string
          id: string
          section: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          section: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          section?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
