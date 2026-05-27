export interface ProductSpec {
  0: string; // label
  1: string; // value
}

export interface Product {
  id: string;
  n: string; // name
  m: string; // model
  p: string; // price
  s: ProductSpec[]; // specs
  d: string; // description
  isStar?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
