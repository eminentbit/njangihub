import { useEffect } from "react";
import { UseFormSetError, UseFormClearErrors } from "react-hook-form";
import { useDebounce } from "./useDebounce";

type AccountSetupForm = {
  email: string;
  phoneNum: string;
};

type UseDebouncedValidationParams<TField extends string> = {
  fieldName: TField;
  value: string;
  validateFn: (val: string) => {
    data: boolean | undefined;
    isFetching: boolean;
  };
  setError: UseFormSetError<AccountSetupForm>;
  clearErrors: UseFormClearErrors<AccountSetupForm>;
  errorMessage: string;
  debounceMs?: number;
};

export const useDebouncedValidation = <TField extends keyof AccountSetupForm>({
  fieldName,
  value,
  validateFn,
  setError,
  clearErrors,
  errorMessage,
  debounceMs = 500,
}: UseDebouncedValidationParams<TField>) => {
  const debouncedValue = useDebounce(value, debounceMs);
  const { data: isValid, isFetching } = validateFn(debouncedValue);

  useEffect(() => {
    if (!debouncedValue) return;
    if (isValid === false) {
      setError(fieldName, {
        type: "manual",
        message: errorMessage,
      });
    } else {
      clearErrors(fieldName);
    }
  }, [isValid, debouncedValue, fieldName, setError, clearErrors, errorMessage]);

  return { isFetching };
};
