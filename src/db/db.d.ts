import { ColumnType } from 'kysely';

export type Decimal = ColumnType<string, string | number, string | number>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Account {
  access_token: string | null;
  createdAt: Generated<Date | null>;
  expires_at: number | null;
  ext_expires_in: number;
  id: string;
  id_token: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  scope: string | null;
  session_state: string | null;
  token_type: string | null;
  type: string;
  updatedAt: Generated<Date | null>;
  userId: string;
}

export interface Order {
  createdAt: Generated<Date | null>;
  id: string;
  orderNumber: Generated<number>;
  s3Key: string;
  supplierId: string;
  updatedAt: Generated<Date | null>;
}

export interface Product {
  createdAt: Generated<Date | null>;
  name: string;
  orderAmount: Decimal;
  orderId: string | null;
  packageSize: Decimal;
  pricePerUnit: Decimal;
  sku: string;
  stock: Decimal;
  supplierId: string;
  unit: unknown | null;
  updatedAt: Generated<Date | null>;
}

export interface Session {
  createdAt: Generated<Date | null>;
  expires: Date;
  id: string;
  sessionToken: string;
  updatedAt: Generated<Date | null>;
  userId: string;
}

export interface Supplier {
  createdAt: Generated<Date | null>;
  email: string;
  id: string;
  name: string;
  updatedAt: Generated<Date | null>;
}

export interface User {
  createdAt: Generated<Date | null>;
  email: string | null;
  emailVerified: Date | null;
  id: string;
  image: string | null;
  name: string;
  updatedAt: Generated<Date | null>;
}

export interface VerificationToken {
  createdAt: Generated<Date | null>;
  expires: Date;
  identifier: string;
  token: string;
  updatedAt: Generated<Date | null>;
}

export interface DB {
  account: Account;
  order: Order;
  product: Product;
  session: Session;
  supplier: Supplier;
  user: User;
  verificationToken: VerificationToken;
}
