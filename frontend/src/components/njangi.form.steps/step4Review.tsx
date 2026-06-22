import React, { useState } from "react";
import { ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import { useFormContext } from "../../context/njangi.form.context";
import Button from "../ExtraButton";
import { useNavigate } from "react-router-dom";
import { useCreateNjangiStore } from "../../store/create.njangi.store";
import ErrorPopup from "../error";

const Step4Review: React.FC = () => {
  const { state, prevStep, submitForm, goToStep } = useFormContext();
  const navigate = useNavigate();
  const [, setisError] = useState(false);
  const { njangiStatusURL, errors } = useCreateNjangiStore();
  const {
    accountSetup,
    groupDetails,
    inviteMembers,
    isSubmitting,
    isSubmitted,
    error,
  } = state;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isSubmitted && !error) {
    sessionStorage.clear();
    return (
      <div className="max-w-2xl mx-auto w-full transition-all duration-300 animate-fadeIn">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={60} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Success!</h2>
          <p className="text-gray-600 mb-6">
            Thank you,{" "}
            <span className="font-semibold">{accountSetup.firstName}</span>!
            Your Njangi group request has been submitted and is now{" "}
            <strong>awaiting BOD approval</strong>.
          </p>
          <p className="text-gray-600 mb-6">
            We'll notify you at{" "}
            <span className="font-semibold">{accountSetup.email}</span> once a
            decision is made.
          </p>
          <p className="text-gray-500 text-sm">
            Approvals typically take <strong>24–48 hours or less</strong>. No
            further action is needed for now.
          </p>
          <div className="mt-6">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                if (
                  njangiStatusURL &&
                  (njangiStatusURL.startsWith("http://") ||
                    njangiStatusURL.startsWith("https://"))
                ) {
                  // Parse the URL and extract the pathname + search
                  try {
                    const url = new URL(njangiStatusURL);
                    // Only navigate internally if the host matches your app
                    if (url.host === window.location.host) {
                      navigate(url.pathname + url.search);
                    } else {
                      window.location.href = njangiStatusURL;
                    }
                  } catch {
                    window.location.href = njangiStatusURL;
                  }
                } else if (njangiStatusURL) {
                  navigate(njangiStatusURL);
                }
              }}
              className="transition-transform hover:scale-105 flex items-center gap-2"
            >
              View Your Njangi State
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full transition-all duration-300 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Review & Submit
        </h2>

        {/* Display error message if it exists */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {errors && (
          <>{<ErrorPopup error={errors} onClose={() => setisError(false)} />}</>
        )}

        <div className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Account Information
              </h3>
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => goToStep(1)}
                rightIcon={<ChevronRight size={16} />}
              >
                Edit
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountSetup.firstName} {accountSetup.lastName}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountSetup.phoneNum}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountSetup.email}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Profile Picture
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {accountSetup.profilePic &&
                    (accountSetup.profilePic as FileList).length > 0
                      ? "Uploaded"
                      : "None"}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Group Details
              </h3>
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => goToStep(2)}
                rightIcon={<ChevronRight size={16} />}
              >
                Edit
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Group Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {groupDetails.groupName}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Contribution
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    FCFA {groupDetails.contributionAmount} (
                    {groupDetails.contributionFrequency})
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Payout Method
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {groupDetails.payoutMethod}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Start Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(groupDetails.startDate)}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    End Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {groupDetails.endDate
                      ? formatDate(groupDetails.endDate)
                      : "Not specified"}
                  </dd>
                </div>

                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Members
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {groupDetails.numOfMembers || "Not specified"}
                  </dd>
                </div>

                {groupDetails.rules && (
                  <div className="col-span-2 flex-wrap max-w-11 w-90%">
                    <dt className="text-sm font-medium text-gray-500">Rules</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {groupDetails.rules}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Invited Members
              </h3>
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => goToStep(3)}
                rightIcon={<ChevronRight size={16} />}
              >
                Edit
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <ul className="space-y-1">
                {inviteMembers.invites?.map((invite, index) => (
                  <li key={index} className="text-sm text-gray-900">
                    {invite.value}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t pt-6 mt-6 flex max-sm:flex-col max-sm:gap-y-3 justify-between">
            <Button
              disabled={isSubmitting}
              type="button"
              variant="outline"
              onClick={prevStep}
              className="transition-transform hover:scale-105"
            >
              Back
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={submitForm}
              isLoading={isSubmitting}
              className="transition-transform hover:scale-105"
            >
              {isSubmitting
                ? "Submitting, Please wait..."
                : "Submit Njangi Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
