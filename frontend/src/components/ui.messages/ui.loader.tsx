type UILoaderProps = {
  text: string;
  subtitle: string;
};

export default function UILoader({ text, subtitle }: UILoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 text-center">
        {/* Animated Spinner */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative w-16 h-16">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            {/* Spinning ring - properly contained */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>

        {/* Loading text with typing animation */}
        <div className="text-blue-700 text-lg font-semibold mb-2">
          {text}
          <span className="animate-pulse">...</span>
        </div>

        {/* Subtitle */}
        <div className="text-blue-500 text-sm">{subtitle}</div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
