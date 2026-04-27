export interface PayslipUser {
  id: number;
  name: string;
}

export interface Payslip {
  id: number;
  created_at: string | null;
  updated_at: string | null;

  user_id: number | null;
  user?: PayslipUser | null;

  days_worked: number | null;
  overtime_hours: number | null;

  daily_rate: number;
  hourly_rate: number;

  total_daily_pay: number | null;
  total_overtime_pay: number | null;

  total_commission: number | null;
  total_bonus: number | null;
  total_deduction: number | null;

  gross_pay: number | null;
  net_pay: number | null;

  start_period: string | null;
  end_period: string | null;
}
