declare module "Yup" {
  interface ArraySchema<T> {
    uniqueProperty(propertyPath: string, message?: string): ArraySchema<T>;
  }
}
