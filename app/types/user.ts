export interface User {
  id: number;
  created_at: string | null;

  name: string;
  password?: string | null;

  role: {
    id: number;
    name: string;
  } | null;

  sss_number?: string | null;
  philhealth_number?: string | null;
  pagibig_number?: string | null;

  hourly_rate?: number | null;
  daily_rate?: number | null;

  is_live_seller: boolean | null;
  is_employee: boolean | null;

  email: string | null;
  address?: string | null;
  phone_number?: string | null;
}
