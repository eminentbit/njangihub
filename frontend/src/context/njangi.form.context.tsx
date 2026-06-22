import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { useCreateNjangiStore } from "../store/create.njangi.store";
import {
  AccountSetupFormData,
  GroupDetailsFormData,
  InviteMembersFormData,
} from "../types/njangi.form.schema.type";
import { NjangiSetup } from "../types/create-njangi-types";

type InviteMemberTypes = {
  type: "email" | "phone";
  value: string;
};

// Form state interface
interface FormState {
  currentStep: number;
  accountSetup: Partial<AccountSetupFormData>;
  groupDetails: Partial<GroupDetailsFormData>;
  inviteMembers: {
    invites: InviteMemberTypes[];
  };
  isSubmitting: boolean;
  isSubmitted: boolean;
  goToStep?: (step: number) => void;
  error: string | null;
}

// Initial state
const initialState: FormState = {
  currentStep: 1,
  accountSetup: {},
  groupDetails: {},
  inviteMembers: {
    invites: [],
  },
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

// Action types
type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "UPDATE_ACCOUNT_SETUP"; payload: Partial<AccountSetupFormData> }
  | { type: "UPDATE_GROUP_DETAILS"; payload: Partial<GroupDetailsFormData> }
  | { type: "UPDATE_INVITE_MEMBERS"; payload: Partial<InviteMembersFormData> }
  | { type: "SUBMIT_FORM" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; payload: string };

// Reducer function
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 4),
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };
    case "UPDATE_ACCOUNT_SETUP":
      return {
        ...state,
        accountSetup: {
          ...state.accountSetup,
          ...action.payload,
        },
      };
    case "UPDATE_GROUP_DETAILS":
      return {
        ...state,
        groupDetails: {
          ...state.groupDetails,
          ...action.payload,
        },
      };
    case "UPDATE_INVITE_MEMBERS":
      return {
        ...state,
        inviteMembers: {
          ...state.inviteMembers,
          ...action.payload,
        },
      };
    case "SUBMIT_FORM":
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        isSubmitted: true,
        error: null,
      };
    case "SUBMIT_ERROR":
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Context type
interface FormContextType {
  state: FormState;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateAccountSetup: (data: Partial<AccountSetupFormData>) => void;
  updateGroupDetails: (data: Partial<GroupDetailsFormData>) => void;
  updateInviteMembers: (data: Partial<InviteMembersFormData>) => void;
  submitForm: () => void;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { errors, createNjangi } = useCreateNjangiStore();

  const nextStep = () => dispatch({ type: "NEXT_STEP" });
  const prevStep = () => dispatch({ type: "PREV_STEP" });
  const goToStep = (step: number) =>
    dispatch({ type: "GO_TO_STEP", payload: step });

  const updateAccountSetup = (data: Partial<AccountSetupFormData>) => {
    dispatch({ type: "UPDATE_ACCOUNT_SETUP", payload: data });
  };

  const updateGroupDetails = (data: Partial<GroupDetailsFormData>) => {
    dispatch({ type: "UPDATE_GROUP_DETAILS", payload: data });
  };

  const updateInviteMembers = (data: Partial<InviteMembersFormData>) => {
    dispatch({ type: "UPDATE_INVITE_MEMBERS", payload: data });
  };

  // Function to handle form submission to the backend
  const submitForm = async () => {
    dispatch({ type: "SUBMIT_FORM" });
    try {
      const submissionData: NjangiSetup = {
        accountSetup: {
          firstName: state.accountSetup.firstName || "",
          lastName: state.accountSetup.lastName || "",
          email: state.accountSetup.email || "",
          phoneNumber: state.accountSetup.phoneNum || "",
          password: state.accountSetup.password || "",
          profilePicUrl:
            Array.isArray(state.accountSetup.profilePic) &&
            state.accountSetup.profilePic.length > 0 &&
            state.accountSetup.profilePic[0] instanceof Blob
              ? URL.createObjectURL(state.accountSetup.profilePic[0])
              : "",
        },
        groupDetails: {
          groupName: state.groupDetails.groupName || "",
          contributionAmount:
            Number(
              (state.groupDetails.contributionAmount || "0").replace(/,/g, "")
            ) || 0,
          contributionFrequency: state.groupDetails.contributionFrequency || "",
          payoutMethod: state.groupDetails.payoutMethod || "",
          startDate: state.groupDetails.startDate || "",
          endDate: state.groupDetails.endDate || "",
          numberOfMember: state.groupDetails.numOfMembers
            ? Number(state.groupDetails.numOfMembers)
            : 0,
          rules: state.groupDetails.rules || "",
        },
        inviteMembers: (state.inviteMembers.invites || []).map((invite) => ({
          ...invite,
          contact: invite.value,
        })),
      };
      console.log("Submission Data:", submissionData);
      await createNjangi(submissionData);
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (error) {
      console.log("Error creating Njangi:", error);
      dispatch({
        type: "SUBMIT_ERROR",
        payload: errors || "An unknown error occurred",
      });
      console.log("Error submitting form:", errors);
    }
  };

  return (
    <FormContext.Provider
      value={{
        state,
        nextStep,
        prevStep,
        goToStep,
        updateAccountSetup,
        updateGroupDetails,
        updateInviteMembers,
        submitForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
// eslint-disable-next-line react-refresh/only-export-components
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
