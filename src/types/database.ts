export type Notice = {
  id: string;
  title: string;
  body: string;
  tag: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  note: string;
  created_at: string;
};

export type Manual = {
  id: string;
  title: string;
  category: string;
  body: string;
  sort_order: number;
  created_at: string;
};

export type Shift = {
  id: string;
  date: string;
  staff_name: string;
  time_range: string;
  created_at: string;
};
