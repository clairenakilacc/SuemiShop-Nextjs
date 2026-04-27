export interface Inventory {
  id: number;

  created_at: string | null;
  updated_at: string | null;

  date_arrived: string | null;
  box_number: string | null;

  supplier_id: number | null;
  category_id: number | null;

  quantity: number;
  price: number;
  total: number;

  quantity_left: number;
  total_left: number;

  supplier?: {
    name: string;
  };

  category?: {
    description: string;
  };
}
