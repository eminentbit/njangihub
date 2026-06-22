import React from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "../../types/auth.validator";

interface AddMemberModalProps {
  editingMember: User | null;
  closeModal: () => void;
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export default function AddMemberModal({
  editingMember,
  closeModal,
  handleSave,
  isSubmitting,
}: AddMemberModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingMember ? "Edit Member Email" : "Add New Member"}
          </h3>
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body/Form */}
        <form onSubmit={handleSave} className="px-6 py-5 space-y-6">
          {/* Only Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={editingMember?.email || ""}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
                         dark:focus:ring-indigo-400 dark:focus:border-indigo-400
                         transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                         hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 
                         dark:hover:bg-gray-600 rounded-md transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                         hover:bg-indigo-700 rounded-md transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : editingMember ? (
                "Update Email"
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
