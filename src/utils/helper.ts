export function getAcronym(txt: string): string {
  return txt.replace(/(\w)\w*\W*/g, function (_, i) {
    return i.toUpperCase();
  });
}

export interface ItemFake {
  id: string;
  content: string;
}

export const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map<ItemFake>((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

export function enumFromStringValue<T>(
  enm: { [s: string]: T },
  value: string
): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? (value as unknown as T)
    : undefined;
}
