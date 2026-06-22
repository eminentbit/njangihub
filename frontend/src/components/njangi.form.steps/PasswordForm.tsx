import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AccountSetupFormData } from "../../types/njangi.form.schema.type";

const PasswordForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<AccountSetupFormData>;
  errors: FieldErrors<AccountSetupFormData>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div>
      <div className="pb-5">
        <label className="form-label">Password</label>
        <div className="relative">
          <Lock size={18} className="form-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`form-input ${
              errors.password ? "form-input-error" : ""
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
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
      <div>
        <label className="form-label">Confirm Password</label>
        <div className="relative">
          <Lock size={18} className="form-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className={`form-input ${
              errors.confirmPassword ? "form-input-error" : ""
            }`}
            autoComplete="new-password"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={toggleConfirmPasswordVisibility}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordForm;
