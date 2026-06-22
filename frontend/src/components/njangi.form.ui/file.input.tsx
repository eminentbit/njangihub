import React, { forwardRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";
import { Upload, X } from "lucide-react";

interface FormFileInputProps {
  label: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  accept?: string;
  className?: string;
}

const FormFileInput = forwardRef<HTMLInputElement, FormFileInputProps>(
  ({ label, error, registration, accept = "image/*", className }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    };

    const clearFile = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Clear the file input
      if (ref && "current" in ref && ref.current) {
        ref.current.value = "";
      }

      setPreview(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && ref && "current" in ref && ref.current) {
        // Create a DataTransfer object to set files programmatically
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        ref.current.files = dataTransfer.files;

        // Trigger change event manually
        const event = new Event("change", { bubbles: true });
        ref.current.dispatchEvent(event);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            "relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-all duration-200",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400",
            error ? "border-red-300" : "",
            className
          )}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            {...registration}
            onChange={(e) => {
              registration?.onChange(e);
              handleFileChange(e);
            }}
            // {...props}
          />

          {preview ? (
            <div className="relative w-full">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex text-sm text-gray-600">
                <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  Upload a file
                </span>
                {/* <p className="pl-1">or drag and drop</p> */}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 5MB
              </p>
            </>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormFileInput.displayName = "FormFileInput";

export default FormFileInput;
