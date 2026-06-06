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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          kaspi_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          kaspi_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          kaspi_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          seller_id: string
          amount: number
          description: string
          status: 'pending' | 'paid' | 'cancelled'
          payer_name: string | null
          payer_phone: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          amount: number
          description: string
          status?: 'pending' | 'paid' | 'cancelled'
          payer_name?: string | null
          payer_phone?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          amount?: number
          description?: string
          status?: 'pending' | 'paid' | 'cancelled'
          payer_name?: string | null
          payer_phone?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      invoice_status: 'pending' | 'paid' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
