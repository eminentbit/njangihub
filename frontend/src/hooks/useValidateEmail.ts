import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { secureGet } from "../utils/axiosClient";

const VALIDATE_API_URL = import.meta.env.VITE_VALIDATE_API_URL;

const buildUrl = (path: string) => {
  //Ensure that there is no duplicate // of avoid where its
  return `${VALIDATE_API_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

// console.log(
//   "Calling validate email URL:",
//   `${VALIDATE_API_URL}/validate-email`
// );
// console.log("BuildUrl: " + buildUrl("validate-email"));

/**
 *
 * @param email - The email address to validate
 * @descrp i* @returns */
export const useValidateEmail = (email: string) => {
  return useQuery({
    queryKey: ["validate-email", email],
    queryFn: async () => {
      const { data } = await secureGet(buildUrl("validate-email"), {
        params: { email },
      });
      return data.valid;
    },
    enabled: !!email, // only run if email is not empty
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
/**
 *
 * @param phoneNumber - The phone number to validate
 * @description This hook is used to validate a phone number. It sends a GET request to the server with the phone number as a query parameter. The server responds with a boolean indicating whether the phone number is valid or not upon filling the form.
 * @returns
 */
export const useValidatePhoneNumber = (phoneNumber: string) => {
  return useQuery({
    queryKey: ["validate-phoneNumber", phoneNumber],
    queryFn: async () => {
      try {
        const { data } = await secureGet(
          `${VALIDATE_API_URL}/validate-phone-number`,
          { params: { phoneNumber } }
        );
        // Always return a boolean value
        return typeof data.valid === "boolean" ? data.valid : false;
      } catch (error) {
        console.error("Error validating phone number:", error);
        return false;
      }
    },
    enabled: !!phoneNumber,
    staleTime: 1000 * 60 * 5,
  });
};
