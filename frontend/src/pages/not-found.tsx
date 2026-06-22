import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasNavigatedRef = useRef(false);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    hasNavigatedRef.current = true;
  }, []);

  return (
    <div className="relative min-h-screen flex items-center flex-col justify-center z-20 px-4 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-200 z-0" />
      <div className="z-20 pt-4 flex flex-col items-center gap-3">
        <h1 className="text-5xl md:text-7xl font-bold text-blue-600 animate-bounce">
          404
        </h1>
        <p className="text-lg font-semibold animate-pulse">
          Oops! Sorry, the page{" "}
          <span className="text-red-500">"{location.pathname}"</span> doesn’t
          exist.
        </p>
        <p className="text-sm text-gray-600">
          It looks like the page was moved or never existed.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            type="button"
            className="bg-gray-100 text-blue-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
