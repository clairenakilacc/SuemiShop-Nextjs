export interface Role {
  id: number;

  created_at: string;
  name: string;
  permissions?: Record<string, any> | null;
}
