import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Phone, Lock } from "lucide-react";
import {
  accountSetupSchema,
  AccountSetupFormData,
} from "../../types/njangi.form.schema.type";
import { useFormContext } from "../../context/njangi.form.context";
import FormInput from "../../components/njangi.form.ui/input";
import FormFileInput from "../../components/njangi.form.ui/file.input";
// import Button from "../ExtraButton";

const Step1AccountInfo: React.FC = () => {
  const { state, updateAccountSetup, nextStep } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    reset,
  } = useForm<AccountSetupFormData>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: state.accountSetup,
    mode: "onChange", // Enable real-time validation
  });

  useEffect(() => {
    reset(state.accountSetup);
  }, [state.accountSetup, reset]);

  const onSubmit = async (data: AccountSetupFormData) => {
    console.log("Submitting Step 1 form with data:", data);
    // Trigger validation for all fields
    const isValid = await trigger();
    console.log("Validation result:", isValid);
    if (!isValid) {
      console.log("Validation failed, not proceeding to next step.");
      return;
    }

    updateAccountSetup(data);
    console.log("Validation passed, moving to next step.");
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto w-full transition-all duration-300 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Setup</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              error={errors.firstName?.message}
              registration={register("firstName")}
              icon={<User size={18} className="text-gray-400" />}
              required
            />

            <FormInput
              label="Last Name"
              error={errors.lastName?.message}
              registration={register("lastName")}
              icon={<User size={18} className="text-gray-400" />}
              required
            />
          </div>

          <FormInput
            label="Phone Number"
            error={errors.phoneNum?.message}
            registration={register("phoneNum")}
            icon={<Phone size={18} className="text-gray-400" />}
            required
          />

          <FormInput
            label="Email"
            error={errors.email?.message}
            registration={register("email")}
            type="email"
            icon={<Mail size={18} className="text-gray-400" />}
            required
          />

          <FormInput
            label="Password"
            error={errors.password?.message}
            registration={register("password")}
            type="password"
            icon={<Lock size={18} className="text-gray-400" />}
            required
          />

          <FormInput
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
            type="password"
            icon={<Lock size={18} className="text-gray-400" />}
            required
          />

          <FormFileInput
            label="Profile Picture (Optional)"
            error={errors.profilePic?.message}
            registration={register("profilePic")}
            accept="image/jpeg, image/png, image/jpg"
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-transform hover:scale-105 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Loading..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1AccountInfo;
