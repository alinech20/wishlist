export type WLItem = {
  id?: string;
  name: string;
  url?: string;
  comment?: string;
  createdOn: string;
  modifiedOn: string;
};

export type WLWishlist = {
  id?: string;
  uid?: string;
  name: string;
  description: string;
  groups?: Array<string>;
  itemList?: Array<WLItem>;
  createdOn?: string;
  modifiedOn?: string;
};
