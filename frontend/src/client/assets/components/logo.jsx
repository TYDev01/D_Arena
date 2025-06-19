export function Logo({ size = "lg" }) {
  const isResponsive = size === "responsive";

  const sizeClasses = isResponsive
    ? "w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 lg:w-14 lg:h-14"
    : {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
      }[size];

  const textSizes = isResponsive
    ? "text-lg sm:text-md md:text-xl lg:text-3xl"
    : {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
        xl: "text-4xl",
      }[size];

  return (
    <div className="flex items-center space-x-1 md:space-x-2 group">
      {/* Logo Icon */}
      <div
        className={`${sizeClasses} relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="20" y="40" width="60" height="20" rx="2" fill="#22d3ee" />
          <rect x="40" y="20" width="20" height="60" rx="2" fill="#22d3ee" />
          <circle cx="50" cy="50" r="4" fill="#1a1a2e" />
        </svg>
      </div>

      {/* Logo Text */}
      <div
        className={`${textSizes} font-bold text-cyan-400 font-mono transition-all duration-300 group-hover:scale-105`}
      >
        D_ARENA
      </div>
    </div>
  );
}
