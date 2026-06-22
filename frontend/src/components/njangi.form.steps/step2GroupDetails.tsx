import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Calendar } from "lucide-react";

import {
  groupDetailsSchema,
  GroupDetailsFormData,
} from "../../types/njangi.form.schema.type";
import { useFormContext } from "../../context/njangi.form.context";
import { useDebounce } from "../../hooks/useDebounce";
import { useValidateGroupName } from "../../hooks/useValidateGroupName";
import Loader from "../loader";
import { profanityList } from "../../utils/profanityList";

const Step2GroupDetails: React.FC = () => {
  const { state, updateGroupDetails, nextStep, prevStep } = useFormContext();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GroupDetailsFormData>({
    resolver: zodResolver(groupDetailsSchema),
    defaultValues: state.groupDetails,
  });

  const groupName = watch("groupName");
  const debouncedGroupName = useDebounce(groupName, 500);
  const startDateString = watch("startDate");

  const { data: isValid, isFetching } =
    useValidateGroupName(debouncedGroupName);

  useEffect(() => {
    if (!debouncedGroupName) return;
    if (isValid === false) {
      setError("groupName", {
        type: "manual",
        message: "Group name already in use! Please choose another.",
      });
    } else if (profanityList.includes(debouncedGroupName.toLowerCase())) {
      setError("groupName", {
        type: "manual",
        message:
          "Group name contains inappropriate language. Please choose another.",
      });
    } else {
      clearErrors("groupName");
    }
  }, [debouncedGroupName, isValid, setError, clearErrors]);

  const onSubmit = async (data: GroupDetailsFormData) => {
    const isValid = await trigger();
    if (!isValid || errors.groupName) {
      console.log("Form validation failed. Please check the errors.");
      return;
    }

    updateGroupDetails(data);

    nextStep();
  };

  const frequencyOptions = ["Weekly", "Bi-weekly", "Monthly"];
  const payoutOptions = ["Rotation", "Lottery", "Bidding"];

  return (
    <div className="max-w-2xl mx-auto w-full transition-all duration-300 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Njangi Group Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Group Name</label>
            <div className="relative mt-1">
              <Users
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                {...register("groupName")}
                className={`form-input ${
                  errors.groupName ? "form-input-error" : ""
                }`}
              />
              {isFetching && (
                <span className="text-sm text-blue-600 animate-pulse">
                  Validating your group name...
                </span>
              )}
              {errors.groupName && (
                <p className="form-error">{errors.groupName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* <label className="form-label">Contribution Amount</label> */}
              <div className="relative mt-1">
                <Controller
                  name="contributionAmount"
                  control={control}
                  defaultValue={state.groupDetails.contributionAmount ?? "0"}
                  rules={{
                    required: "Contribution is required",
                    min: { value: 0.01, message: "Must be at least 0.01" },
                  }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label className="form-label">Contribution Amount</label>
                      <div className="relative mt-1">
                        <NumericFormat
                          {...field}
                          // show commas as thousands separators
                          thousandSeparator
                          // allow two decimals
                          decimalScale={0}
                          fixedDecimalScale
                          // disallow negative
                          allowNegative={false}
                          // pass the raw numeric string back to RHF
                          onValueChange={(values) => {
                            const raw = values.value.replace(/,/g, "");
                            field.onChange(raw);
                          }}
                          className={`form-input ${
                            fieldState.error ? "form-input-error" : ""
                          }`}
                          placeholder="0.00"
                        />
                        <div
                          className="absolute left-3 pr-3 top-2.5 text-gray-400"
                          children={"₣"}
                        />
                      </div>
                      {fieldState.error && (
                        <p className="form-error">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />

                {/* <div
                  className="absolute left-3 top-2.5 text-gray-400"
                  children={"₣"}
                />
                {errors.contributionAmount && (
                  <p className="form-error">
                    {errors.contributionAmount.message}
                  </p>
                )} */}
              </div>
            </div>

            <div>
              <label className="form-label">Contribution Frequency</label>
              <select
                {...register("contributionFrequency")}
                className={`block w-full pl-3 pr-3 py-2 border ${
                  errors.contributionFrequency ? "form-input-error" : ""
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select Frequency</option>
                {frequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.contributionFrequency && (
                <p className="form-error">
                  {errors.contributionFrequency.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payout Method
            </label>
            <select
              {...register("payoutMethod")}
              className={`block w-full pl-3 pr-3 py-2 border ${
                errors.payoutMethod ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select Payout Method</option>
              {payoutOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.payoutMethod && (
              <p className="form-error">{errors.payoutMethod.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="relative mt-1">
                <Calendar
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="date"
                  {...register("startDate")}
                  className={`form-input ${
                    errors.startDate ? "form-input-error" : ""
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.startDate && (
                  <p className="form-error">{errors.startDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">End Date (Optional)</label>
              <div className="relative mt-1">
                <Calendar
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  type="date"
                  {...register("endDate", {
                    validate: (val) => {
                      if (startDateString && val && val < startDateString) {
                        return "End date cannot be before start date";
                      }
                      return true;
                    },
                  })}
                  className={`form-input ${
                    errors.endDate ? "form-input-error" : ""
                  }`}
                  min={startDateString}
                />
                {errors.endDate && (
                  <p className="form-error">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Members (Optional)
            </label>
            <div className="relative mt-1">
              <Users
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="number"
                {...register("numOfMembers")}
                className={`form-input ${
                  errors.numOfMembers ? "form-input-error" : ""
                }`}
                min="1"
                step="1"
              />
              {errors.numOfMembers && (
                <p className="form-error">{errors.numOfMembers.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="form-label">Group Rules (Optional)</label>
            <textarea
              {...register("rules")}
              className={`form-textarea ${
                errors.rules ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe the rules and expectations for your Njangi group..."
            />
            {errors.rules && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rules.message}
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-transform hover:scale-105"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isFetching || !!errors.groupName}
              className={`form-button ${
                isSubmitting || isFetching || !!errors.groupName
                  ? "form-button-disabled"
                  : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader />
                  Processing...
                </span>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2GroupDetails;
