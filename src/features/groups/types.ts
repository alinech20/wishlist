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

export enum WLGroupMembershipStatus {
  DECLINED = "Declined",
  REJECTED = "Rejected",
  INVITED = "Invited",
  REQUESTED = "Requested",
  ACCEPTED = "Accepted",
}

export type WLUserGroup = {
  joinedOn: string;
  admin: boolean;
  status: WLGroupMembershipStatus;
  group: WLGroup;
};
