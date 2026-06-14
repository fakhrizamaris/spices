export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          name_id: string
          name_en: string
          description_id: string
          description_en: string
          origin_id: string
          origin_en: string
          category: 'whole_spice' | 'ground_spice' | 'essential_oil' | 'oleoresin' | 'other'
          moisture_max: number | null
          ash_max: number | null
          available_forms: string[]
          min_order_kg: number | null
          is_published: boolean
          featured: boolean
          cover_url: string | null
          stock_status: 'available' | 'limited' | 'out_of_stock'
          stock_note: string | null
          scientific: string
          blurb_id: string
          long_desc_id: string
          capacity: string
          moq: string
          specs: { label_id: string; label_en: string; value: string }[]
          gallery: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_id: string
          name_en: string
          description_id?: string
          description_en?: string
          origin_id?: string
          origin_en?: string
          category?: 'whole_spice' | 'ground_spice' | 'essential_oil' | 'oleoresin' | 'other'
          moisture_max?: number | null
          ash_max?: number | null
          available_forms?: string[]
          min_order_kg?: number | null
          is_published?: boolean
          featured?: boolean
          cover_url?: string | null
          stock_status?: 'available' | 'limited' | 'out_of_stock'
          stock_note?: string | null
          scientific?: string
          blurb_id?: string
          long_desc_id?: string
          capacity?: string
          moq?: string
          specs?: { label_id: string; label_en: string; value: string }[]
          gallery?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_id?: string
          name_en?: string
          description_id?: string
          description_en?: string
          origin_id?: string
          origin_en?: string
          category?: 'whole_spice' | 'ground_spice' | 'essential_oil' | 'oleoresin' | 'other'
          moisture_max?: number | null
          ash_max?: number | null
          available_forms?: string[]
          min_order_kg?: number | null
          is_published?: boolean
          featured?: boolean
          cover_url?: string | null
          stock_status?: 'available' | 'limited' | 'out_of_stock'
          stock_note?: string | null
          scientific?: string
          blurb_id?: string
          long_desc_id?: string
          capacity?: string
          moq?: string
          specs?: { label_id: string; label_en: string; value: string }[]
          gallery?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string | null
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      gallery: {
        Row: {
          id: string
          url: string
          caption_id: string | null
          caption_en: string | null
          category: 'facility' | 'product' | 'certification' | 'team' | 'other'
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          caption_id?: string | null
          caption_en?: string | null
          category?: 'facility' | 'product' | 'certification' | 'team' | 'other'
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          caption_id?: string | null
          caption_en?: string | null
          category?: 'facility' | 'product' | 'certification' | 'team' | 'other'
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          country: string | null
          whatsapp: string | null
          volume: string | null
          company: string | null
          phone: string | null
          product_id: string | null
          quantity_kg: number | null
          message: string
          status: 'new' | 'in_progress' | 'replied' | 'closed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          country?: string | null
          whatsapp?: string | null
          volume?: string | null
          company?: string | null
          phone?: string | null
          product_id?: string | null
          quantity_kg?: number | null
          message: string
          status?: 'new' | 'in_progress' | 'replied' | 'closed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          country?: string | null
          whatsapp?: string | null
          volume?: string | null
          company?: string | null
          phone?: string | null
          product_id?: string | null
          quantity_kg?: number | null
          message?: string
          status?: 'new' | 'in_progress' | 'replied' | 'closed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inquiries_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          label: string
          group: 'general' | 'contact' | 'seo' | 'social' | 'hero'
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string
          label: string
          group?: 'general' | 'contact' | 'seo' | 'social' | 'hero'
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          label?: string
          group?: 'general' | 'contact' | 'seo' | 'social' | 'hero'
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
