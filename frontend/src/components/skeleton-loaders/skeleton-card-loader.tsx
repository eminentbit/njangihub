export const Skeleton: React.FC<{ className?: string; animate?: boolean }> = ({
  className = "",
  animate = true,
}) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded ${
      animate ? "animate-pulse" : ""
    } ${className}`}
  />
);
