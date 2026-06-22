import { AccountSetUp, GroupDetails } from "./create-njangi-types";

export interface GroupRequest {
  createdAt: string;
  _id: string;
  accountSetup: AccountSetUp;
  groupDetails: GroupDetails;
  inviteMembers: {
    value: string;
    type: string;
    contact: string;
    name?: string;
  }[];
  adminEmail: string;
  njangiRouteId: string;
  numberOfMember: number;
}
