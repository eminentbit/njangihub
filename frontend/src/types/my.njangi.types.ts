type NjangiAccountSetup = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
};

type NjangiGroupDetails = {
  groupName: string;
  contributionAmount: number;
  contributionFrequency: string;
  payoutMethod: string;
  startDate: string;
  endDate: string;
  numberOfMember: number;
  rules: string;
  status: string;
};

type NjangiInviteMember = {
  type: string;
  value: string;
  contact: string;
};

export type MyNjangiResponse = {
  id: string;
  status: string;
  submittedAt: string;
  canEdit?: boolean;
  editDeadline?: string;
  groupName: string;
  contributionAmount: number;
  frequency: string;
  members: number;
  startDate: string;
  accountSetup: NjangiAccountSetup;
  groupDetails: NjangiGroupDetails;
  inviteMembers: NjangiInviteMember[];
};