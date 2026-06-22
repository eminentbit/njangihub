import { useForm } from "react-hook-form";

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

interface InputFieldProps {
  label: string;
  icon: React.ComponentType<{ className: string }>;
  type?: string;
  register: ReturnType<typeof useForm<ProfileFormData>>["register"];
  name: keyof ProfileFormData;
  error?: { message?: string };
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  type = "text",
  register,
  name,
  error,
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        disabled={disabled}
        {...register(name, { required: `${label} is required` })}
        className={`block w-full pl-10 pr-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
      />
    </div>
    {error?.message && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

export default InputField;
