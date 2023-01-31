export type WLItem = {
  id?: number;
  name: string;
  url: string;
  comment: string;
};

export type WLGroup = {
  id?: string;
  name: string;
  event?: string;
  date?: string;
  budget?: number;
  createdBy: string;
  createdOn?: string;
  modifiedOn?: string;
};

export type WLUserGroup = {
  joinedOn: string;
  admin: boolean;
  group: WLGroup;
};
