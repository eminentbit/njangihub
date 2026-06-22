import { FormProvider } from "../context/njangi.form.context";
import FormStepper from "../components/njangi.form.steps/Formstepper";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NjangiForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center p-6">
      <div
        className="absolute left-4 top-4 text-sm flex items-center gap-1 cursor-pointer hover:bg-blue-100 hover:text-blue-600 py-2 px-4 hover:rounded-md transition-colors duration-300 group"
        onClick={() => navigate("/")}
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-all duration-300"
        />
        Back to Home
      </div>
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6 mt-5">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Create Your Njangi Group
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto md:text-lg text-sm">
            Set up your Njangi savings group in just a few simple steps. Fill
            out the information below to get started.
          </p>
        </div>

        <FormProvider>
          <FormStepper />
        </FormProvider>
      </div>
    </div>
  );
}

export default NjangiForm;
