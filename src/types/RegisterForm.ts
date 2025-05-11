export type RegisterForm<Key extends string | number | symbol, Value> = {
  [key in Key]: Value;
};
