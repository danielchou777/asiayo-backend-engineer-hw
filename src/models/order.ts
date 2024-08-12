export interface Order {
  id: string;
  name: string;
  address: {
    city: string;
    district: string;
    street: string;
  };
  price: string;
  currency: string;
}
