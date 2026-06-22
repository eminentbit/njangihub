import React, { useEffect, useMemo, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Info } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  inviteMembersSchema,
  InviteMembersFormData,
} from "../../types/njangi.form.schema.type";
import { useFormContext } from "../../context/njangi.form.context";
import { useDebounce } from "../../hooks/useDebounce";
import { useBatchValidateInvites } from "../../hooks/useBatchValidateInvites";
import Loader from "../loader";

const MAX_MEMBERS = 3;

const Step3InviteMembers: React.FC = () => {
  const { state, updateInviteMembers, nextStep, prevStep } = useFormContext();
  const manualPhoneErrors = useRef<{ [key: number]: string }>({});

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteMembersFormData>({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues: state.inviteMembers.invites?.length
      ? state.inviteMembers
      : { invites: [{ type: "email", value: "" }] },
  });
  const tempData = JSON.parse(sessionStorage.getItem("tempData") ?? "{}");
  const creatorPhoneObj = JSON.parse(
    sessionStorage.getItem("tempPhone") ?? "{}"
  );
  const creatorPhone = creatorPhoneObj.senderPhone || "";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invites",
  });

  const onSubmit = (data: InviteMembersFormData) => {
    updateInviteMembers(data);
    nextStep();
  };

  const watchedInvites = useWatch({
    control,
    name: "invites",
  });

  const normalizedInvites = useMemo(() => {
    return (watchedInvites ?? []).map((invite) => ({
      type: invite?.type,
      value: (invite?.value ?? "").trim().toLowerCase(),
    }));
  }, [watchedInvites]);

  const debouncedInvites = useDebounce(normalizedInvites, 500);

  const { isFetching } = useBatchValidateInvites(
    debouncedInvites,
    setError,
    clearErrors,
    manualPhoneErrors
  );

  // Update handlePhoneChange
  const handlePhoneChange = (index: number, value: string) => {
    const formatted = `+${value.replace(/^\+/, "")}`;
    const isDuplicate = watchedInvites?.some(
      (invite, i) =>
        i !== index &&
        invite?.type === "phone" &&
        invite?.value?.replace(/^\+/, "") === value.replace(/^\+/, "")
    );
    const isCreatorPhone =
      creatorPhone &&
      formatted.replace(/^\+/, "") === creatorPhone.replace(/^\+/, "");

    setValue(`invites.${index}.value`, formatted);

    if (isCreatorPhone) {
      setError(`invites.${index}.value`, {
        type: "manual",
        message: "Cannot be the same as creator's phone number",
      });
      manualPhoneErrors.current[index] =
        "Cannot be the same as creator's phone number";
      return;
    }
    if (isDuplicate) {
      setError(`invites.${index}.value`, {
        type: "manual",
        message: "This phone number is already added.",
      });
      manualPhoneErrors.current[index] = "This phone number is already added.";
      return;
    }
    clearErrors(`invites.${index}.value`);
    delete manualPhoneErrors.current[index];
  };

  // Re-apply manual errors after debounce
  useEffect(() => {
    Object.entries(manualPhoneErrors.current).forEach(([index, message]) => {
      setError(`invites.${Number(index)}.value`, {
        type: "manual",
        message,
      });
    });
  }, [watchedInvites, setError]);

  return (
    <div className="max-w-2xl mx-auto w-full transition-all duration-300 animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Invite Members
        </h2>

        <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-md mb-4 flex items-start gap-2">
          <Info size={16} className="mt-1 text-blue-500" />
          <span>
            You can invite up to 3 members during setup. You'll be able to add
            more later from your dashboard.
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          Add email addresses or phone numbers of people you'd like to invite to
          your Njangi group.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-grow">
                <label className="form-label font-medium text-gray-700">
                  Member {index + 1}
                </label>

                <div className="flex gap-2 mt-1">
                  <select
                    {...register(`invites.${index}.type`)}
                    onChange={(e) => {
                      const selectedType = e.target.value;

                      setValue(
                        `invites.${index}.type`,
                        selectedType as "email" | "phone"
                      );
                      clearErrors(`invites.${index}.value`);
                    }}
                    className="form-select rounded-md border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>

                  {(watchedInvites?.[index]?.type ?? "email") === "email" ? (
                    <input
                      type="email"
                      {...register(`invites.${index}.value`)}
                      placeholder="example@email.com"
                      onChange={(e) => {
                        if (
                          tempData &&
                          tempData.senderEmail == e.target.value
                        ) {
                          setError(`invites.${index}.value`, {
                            type: "manual",
                            message: "Cannot be the same as creator",
                          });
                        } else {
                          clearErrors();

                          const updatedTempData = {
                            ...tempData,
                            [`email${index}`]: (e.target as HTMLInputElement)
                              .value,
                          };
                          sessionStorage.setItem(
                            "tempData",
                            JSON.stringify(updatedTempData)
                          );

                          if (index > 0) {
                            if (
                              (e.target as HTMLInputElement).value ===
                              tempData[`email${index - 1}`]
                            ) {
                              setError(`invites.${index}.value`, {
                                type: "manual",
                                message: "Cannot be the same as previous email",
                              });
                            }
                          }
                        }
                      }}
                      className={`form-input flex-1 rounded-md border pl-3 ${
                        errors.invites?.[index]?.value
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                  ) : (
                    <div className="flex-1">
                      <PhoneInput
                        country={"cm"}
                        value={watchedInvites?.[index]?.value ?? ""}
                        onChange={(value) => handlePhoneChange(index, value)}
                        inputProps={{
                          name: `invites.${index}.value`,
                          required: true,
                        }}
                        enableSearch
                        countryCodeEditable={false}
                        preferredCountries={["cm", "us", "ca", "gb"]}
                        inputClass="w-full !pl-10 !py-2 !border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  )}
                </div>
                {isFetching && (
                  <span className="text-sm text-blue-600 animate-pulse mt-1 ml-20">
                    Validating your invites...
                  </span>
                )}
                {errors.invites?.[index]?.value && (
                  <p className="form-error mt-1 ml-20">
                    {errors.invites[index].value?.message}
                  </p>
                )}
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-7 text-red-500 hover:bg-red-50 p-2 rounded-md transition-transform hover:scale-105"
                  aria-label="Remove member"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (fields.length < MAX_MEMBERS) {
                  append({ type: "email", value: "" });
                }
              }}
              disabled={fields.length >= MAX_MEMBERS}
              className={`flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition-transform hover:scale-105 ${
                fields.length >= MAX_MEMBERS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <Plus size={18} /> Add Another Member
            </button>

            {fields.length >= MAX_MEMBERS && (
              <div className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                <strong>NB:</strong>
                <span>
                  You can only invite {MAX_MEMBERS} members for now. You’ll be
                  able to add more from your dashboard after setup.
                </span>
                <div className="relative group max-sm:hidden">
                  <Info
                    size={16}
                    className="text-gray-400 mt-0.5 cursor-pointer"
                  />
                  <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 bottom-full left-1/2 transform -translate-x-1/2 mb-1 whitespace-nowrap">
                    After your Njangi is created, you can add more members from
                    the dashboard.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-transform hover:scale-105"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isFetching ||
                fields.some((_, index) => !!errors.invites?.[index]?.value)
              }
              className={`form-button ${
                isSubmitting ||
                isFetching ||
                fields.some((_, index) => !!errors.invites?.[index]?.value)
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

export default Step3InviteMembers;
