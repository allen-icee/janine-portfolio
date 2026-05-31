// src/types/adminRates.ts

export type CategoryRow = {
  id?: string;
  title: string;
  description: string;
  icon_name: string;
  note: string;
  inclusions: string[];
  sort_order: number;
  is_active: boolean;
};

export type GroupRow = {
  id?: string;
  category_id: string;
  title: string;
  description: string;
  note: string;
  sort_order: number;
  is_active: boolean;
};

export type RateRow = {
  id?: string;
  group_id: string;
  name: string;
  rate_text: string;
  sort_order: number;
  is_active: boolean;
};

export const emptyCategory: CategoryRow = {
  title: "",
  description: "",
  icon_name: "ph:currency-circle-dollar-duotone",
  note: "",
  inclusions: [],
  sort_order: 0,
  is_active: true,
};

export const emptyGroup: GroupRow = {
  category_id: "",
  title: "",
  description: "",
  note: "",
  sort_order: 0,
  is_active: true,
};

export const emptyRate: RateRow = {
  group_id: "",
  name: "",
  rate_text: "",
  sort_order: 0,
  is_active: true,
};
