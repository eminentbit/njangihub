import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { secureGet } from "../utils/axiosClient";

// const API_URL = import.meta.env.VITE_VALIDATE_API_URL;
// console.log("API_URL from useValidateGroupName", API_URL);

export const useValidateGroupName = (groupName: string) => {
  console.log("groupName from useValidateGroupName", groupName);
  return useQuery({
    queryKey: ["validate-group-name", groupName],
    queryFn: async () => {
      try {
        const { data } = await secureGet(`validate-group-name`, {
          params: { groupName },
        });
        // Always return a boolean value
        return typeof data.valid === "boolean" ? data.valid : false;
      } catch (error) {
        console.error("Error validating group name:", error);
        return false;
      }
    },
    enabled: !!groupName, // only run if groupName is not empty
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
