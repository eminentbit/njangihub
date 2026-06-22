import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Users, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  inviteFormSchema,
  InviteFormSchemaData,
} from "../types/accept.invite.validator";
import { useAcceptInviteStore } from "../store/accept.invite.store";
import ErrorPopup from "../components/error";
import Button from "../components/ExtraButton";
import { useNavigate } from "react-router-dom";
import { useValidateInvitationToken } from "../store/validate.registration.token.draftid.tsx";
import InviteTokenStatusUi from "../components/ui.messages/invalid.token.ui.msg";
import UILoader from "../components/ui.messages/ui.loader";
import toast from "react-hot-toast";

export default function InviteMemberRegistrationForm() {
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const inviteEmail = searchParams.get("email");
  const invitePhone = searchParams.get("phone");
  const { acceptInvite, isErrors } = useAcceptInviteStore();
  const { validateInvitationToken } = useValidateInvitationToken();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [inviteStatus, setInviteStatus] = useState<
    "valid" | "invalid" | "expired" | "missing"
  >("valid");



  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    reset,
  } = useForm<InviteFormSchemaData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: inviteEmail || "",
      phoneNum: invitePhone || "",
      password: "",
    },
    mode: "onChange",
  });

  // check if inviteToken is present
  useEffect(() => {
    if (!inviteToken) {
      setInviteStatus("missing");
      setLoading(false);
      return;
    }
    //API call to validate invite token
    (async () => {
      setLoading(true);
      const result = await validateInvitationToken(inviteToken);
      if (!result) setInviteStatus("invalid");
      else if (result.status === "expired") setInviteStatus("expired");
      else if (result.status === "accepted") {
        // Redirect to login with inviteToken
        navigate(`/login?inviteToken=${inviteToken}&alreadyAccepted=1`);
        return;
      } else setInviteStatus("valid");
      setLoading(false);
    })();
  }, [validateInvitationToken, inviteToken, navigate]);

  if (loading) {
    return (
      <>
        <UILoader
          text="Validating invite"
          subtitle="Please wait while we verify your invitation"
        />
      </>
    );
  }

  if (inviteStatus !== "valid") {
    return (
      <>
        <InviteTokenStatusUi inviteStatus={inviteStatus} />
      </>
    );
  }

  // Handle phone change and update the form
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setValue("phoneNum", `+${value}`);
    trigger("phoneNum");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: InviteFormSchemaData) => {
    try {
      // Simulate API call
      console.log("Submitting data:", { ...data, inviteToken });
      if (!inviteToken) {
        console.log("No invite token provided");
        return;
      }
      const response = await acceptInvite(inviteToken, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNum,
        password: data.password,
      });
      // Redirect based on response (e.g., to group dashboard)
      if (response && response.userId && response.message) {
        navigate(`/user/dashboard?userId=${response.userId}`);
        console.log(`/user/dashboard?userId=${response.userId}`);
        toast.success(
          `Welcome ${data.firstName}, you have successfully joined ${response.groupName}`,
          {
            duration: 5000,
            position: "top-right",
          }
        );
      } else {
        toast.error("Failed to join the group. Please try again.", {
          duration: 5000,
          position: "top-right",
        })
        console.log(`Error: ${response?.message || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {isErrors && <ErrorPopup error={isErrors} onClose={() => reset()} />}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border-0">
        <div className="text-center space-y-4 pb-8 pt-8 px-6">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Join Your Njangi Group
            </h1>
            <p className="text-gray-600 mt-2">
              Complete your registration to join the NjangiHub community and
              start your savings journey
            </p>
          </div>
        </div>

        <div className="space-y-6 px-6 pb-6">
          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 border-b pb-4">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Verified</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors.firstName ? "form-input-error" : ""
                  }`}
                  placeholder="John"
                  required
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors.lastName ? "form-input-error" : ""
                  }`}
                  placeholder="Doe"
                  required
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                readOnly
                {...register("email")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  errors.email ? "form-input-error" : ""
                }`}
                placeholder="your.email@example.com"
                required
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Phone number field */}
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="relative">
                {/* Using react-phone-input-2 library with custom styling */}
                <PhoneInput
                  country={"cm"}
                  value={phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phoneNum",
                    required: true,
                  }}
                  enableSearch={true}
                  searchPlaceholder="Search countries..."
                  countryCodeEditable={false}
                  disableSearchIcon={false}
                  preferredCountries={["cm", "us", "ca", "gb"]}
                />
                {errors.phoneNum && (
                  <p className="form-error">{errors.phoneNum.message}</p>
                )}
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors.password ? "form-input-error" : ""
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth={true}
              variant="primary"
              disabled={isSubmitting || !inviteToken}
              isLoading={isSubmitting}
              className="transition-transform hover:scale-105"
            >
              {isSubmitting ? "Joining, please wait..." : "Join Njangi Group"}
            </Button>
          </form>

          {/* Footer text */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>
              By joining, you agree to NjangiHub's{" "}
              <Link
                to="#"
                className="text-blue-600 hover:underline focus:outline-none focus:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="#"
                className="text-blue-600 hover:underline focus:outline-none focus:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
