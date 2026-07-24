export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      game_states: {
        Row: {
          id: string;
          user_id: string;
          player: Json;
          inventory: Json;
          adventures: Json;
          sessions: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          player: Json;
          inventory: Json;
          adventures: Json;
          sessions?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          player?: Json;
          inventory?: Json;
          adventures?: Json;
          sessions?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_states_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
