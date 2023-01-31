export const getNicelyFormattedCurrentDate: Function = (): string =>
  new Date().toISOString().replace("T", " ").replace("Z", "");

export const getISOFormattedCurrentDate: Function = (): string =>
  new Date().toISOString();
