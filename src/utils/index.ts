export { generateUser } from "./mock";

export { isDate, getRandomDate, formatDate } from "./date";

export function insertAt<T>(
  arr: Array<T>,
  index: number,
  newItem: T
): Array<T> {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
}
