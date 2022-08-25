export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Customer = {
  __typename?: 'Customer';
  _id: Scalars['ID'];
  age: Scalars['Int'];
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrder: Order;
};


export type MutationCreateOrderArgs = {
  customerId: Scalars['ID'];
  price: Scalars['Int'];
  productId: Array<Scalars['ID']>;
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['ID'];
  customer: Customer;
  price: Scalars['Int'];
  products: Array<Product>;
};

export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  customers: Array<Customer>;
  products: Array<Product>;
};
