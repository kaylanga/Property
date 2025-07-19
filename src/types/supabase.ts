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
      properties: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          status: string
          pricing: Json
          location: Json
          features: Json
          media: Json
          agent: Json
          agentId: string
          createdAt: string
          updatedAt: string
          listedAt: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          status?: string
          pricing: Json
          location: Json
          features: Json
          media?: Json
          agent: Json
          agentId: string
          createdAt?: string
          updatedAt?: string
          listedAt?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          status?: string
          pricing?: Json
          location?: Json
          features?: Json
          media?: Json
          agent?: Json
          agentId?: string
          createdAt?: string
          updatedAt?: string
          listedAt?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          property_id: string
          amount: number
          currency: string
          status: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          amount: number
          currency: string
          status?: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          amount?: number
          currency?: string
          status?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
          updated_at: string
          read_at?: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          created_at?: string
          updated_at?: string
          read_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          read_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
