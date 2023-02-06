export type WLItem = {
  id?: string;
  name: string;
  url: string;
  comment: string;
};

export type WLWishlist = {
  id?: string;
  uid?: string;
  name: string;
  description: string;
  groups?: Array<string>;
  createdOn?: string;
  modifiedOn?: string;
};
