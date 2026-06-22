/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Calendar, Users } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { editNjangiSchema } from "../../types/edit.special.ui.njangi.schema";
import { useUpdateNjangiStore } from "../../store/updateNjangiDetails.store";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
type EditNjangiFormData = z.infer<typeof editNjangiSchema>;

interface EditNjangiModalProps {
  njangi: any;
  onClose: () => void;
}
export function EditNjangiModal({ njangi, onClose }: EditNjangiModalProps) {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const { updateNjangi, njangis, setNjangis } = useUpdateNjangiStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditNjangiFormData>({
    resolver: zodResolver(editNjangiSchema),
    defaultValues: {
      groupName: njangi.groupDetails.groupName,
      contributionAmount: njangi.groupDetails.contributionAmount,
      contributionFrequency: njangi.groupDetails.contributionFrequency,
      numberOfMember: njangi.groupDetails.numberOfMember,
      startDate: njangi.groupDetails.startDate
        ? new Date(njangi.groupDetails.startDate)
        : undefined,
      endDate: njangi.groupDetails.endDate
        ? new Date(njangi.groupDetails.endDate)
        : undefined,
      payoutMethod: njangi.groupDetails.payoutMethod,
      rules: njangi.groupDetails.rules,
    },
  });

  // Lock scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const onSubmit = async (data: EditNjangiFormData) => {
    const payload = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    };
    const result = await updateNjangi(draftId, payload);
    if (result?.sucess) {
      onClose();
      toast.success(result.message, {
        position: "top-right",
        duration: 5000,
      });
      //Update the edited Njangi in the store
      const updated = njangis.map((n) =>
        n._id === draftId ? { ...n, ...payload } : n
      );
      setNjangis(updated);
      queryClient.invalidateQueries({ queryKey: ["njangiDetails"] });
    } else {
      toast.error(result?.message || "Update failed! Please try again later.", {
        position: "top-right",
        duration: 5000,
      });
    }
  };
  const startDate = watch("startDate");

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] overflow-y-auto relative z-50 max-md:w-[90%]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="md:text-xl text-lg font-semibold text-gray-900">
              Edit {njangi.groupDetails.groupName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              {...register("groupName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter group name"
            />
            {errors.groupName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.groupName.message}
              </p>
            )}
          </div>

          {/* Contribution Amount and Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contributionAmount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contribution Amount (FCFA)
              </label>
              <input
                type="number"
                id="contributionAmount"
                {...register("contributionAmount", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="25000"
              />
              {errors.contributionAmount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contributionAmount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contributionFrequency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="inline h-4 w-4 mr-1" />
                Frequency
              </label>
              <select
                id="contributionFrequency"
                {...register("contributionFrequency")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
              </select>
              {errors.contributionFrequency && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contributionFrequency.message}
                </p>
              )}
            </div>
          </div>

          {/* Number of Members */}
          <div>
            <label
              htmlFor="numberOfMember"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Users className="inline h-4 w-4 mr-1" />
              Number of Members
            </label>
            <input
              type="number"
              id="numberOfMember"
              {...register("numberOfMember", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="8"
              min="2"
              max="50"
            />
            {errors.numberOfMember && (
              <p className="text-red-600 text-sm mt-1">
                {errors.numberOfMember.message}
              </p>
            )}
          </div>

          {/* Start and End Dates */}
          <div className="flex items-center gap-4 max-sm:flex justify-between w-full">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <Controller
                control={control}
                name="startDate"
                rules={{ required: "Start date is required" }}
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    {...rest}
                    selected={value}
                    onChange={(date) => onChange(date ?? undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholderText="Select start date"
                    dateFormat="yyyy-MM-dd"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <Controller
                control={control}
                name="endDate"
                rules={{
                  required: "End date is required",
                  validate: (value) => {
                    const start = getValues("startDate");
                    if (start && value && value < start) {
                      return "End date cannot be before start date";
                    }
                    return true;
                  },
                }}
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    {...rest}
                    selected={value}
                    onChange={(date) => onChange(date ?? undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholderText="Select end date"
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
                  />
                )}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Payout Method */}
          <div>
            <label
              htmlFor="payoutMethod"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Payout Method
            </label>
            <select
              id="payoutMethod"
              {...register("payoutMethod")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Select payout method</option>
              <option value="Bidding">Bidding</option>
              <option value="Lottery">Lottery</option>
              <option value="Rotation">Rotation</option>
            </select>
            {errors.payoutMethod && (
              <p className="text-red-600 text-sm mt-1">
                {errors.payoutMethod.message}
              </p>
            )}
          </div>

          {/* Rules */}
          <div>
            <label
              htmlFor="rules"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Group Rules
            </label>
            <textarea
              id="rules"
              {...register("rules")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Enter group rules and regulations..."
            />
            {errors.rules && (
              <p className="text-red-600 text-sm mt-1">
                {errors.rules.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Njangi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
