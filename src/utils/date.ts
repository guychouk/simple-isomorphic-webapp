export function getRandomDate(from: Date, to: Date): Date {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

export function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

export function isDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj.toString() !== "Invalid Date" && !isNaN(dateObj.getTime());
}
