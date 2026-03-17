export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: { id?: string; name: string; created_at?: string }
        Update: { id?: string; name?: string; created_at?: string }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          image_url: string | null
          usage: string | null
          side_effect: string | null
          dosage: string | null
          warning: string | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          image_url?: string | null
          usage?: string | null
          side_effect?: string | null
          dosage?: string | null
          warning?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          image_url?: string | null
          usage?: string | null
          side_effect?: string | null
          dosage?: string | null
          warning?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_id: string
          product_name: string
          quantity: number
          note: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          product_name: string
          quantity?: number
          note?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          note?: string | null
          status?: string
          created_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string | null
          summary: string | null
          content: string | null
          image_url: string | null
          author: string | null
          published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          summary?: string | null
          content?: string | null
          image_url?: string | null
          author?: string | null
          published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          summary?: string | null
          content?: string | null
          image_url?: string | null
          author?: string | null
          published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
