import { useNavigate } from "react-router-dom";

const NoNjangiMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center max-sm:w-[90%] gap-4 p-6 rounded-xl max-w-md mx-auto bg-white shadow-lg text-center">
        <p className="text-lg font-medium text-gray-700">
          You don't have any active Njangi.
        </p>
        <p className="text-sm text-gray-500">
          You can create a new one or return to the homepage.
        </p>

        <div className="flex gap-4 mt-2 max-md:flex-col">
          <button
            type="button"
            onClick={() => navigate("/njangi-form")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Create Another Njangi
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoNjangiMessage;
