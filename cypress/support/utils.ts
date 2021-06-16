export const isNullOrType = (obj, type_: string): boolean => {
  return obj === null || typeof obj === type_
}
