export const getNicelyFormattedCurrentDateTime: Function = (): string =>
  new Date().toISOString().replace("T", " ").replace("Z", "");

export const getISOFormattedCurrentDateTime: Function = (): string =>
  new Date().toISOString();

export const getNicelyFormattedDate: Function = (date: string): string =>
  date.slice(0, 10);
