export function Logo({ size = "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div className="flex items-center space-x-3 group">
      {/* Logo Icon - Cross/Plus Shape */}
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal bar */}
          <rect x="20" y="40" width="60" height="20" rx="2" fill="#22d3ee" />

          {/* Vertical bar */}
          <rect x="40" y="20" width="20" height="60" rx="2" fill="#22d3ee" />

          {/* Center circle */}
          <circle cx="50" cy="50" r="4" fill="#1a1a2e" />
        </svg>
      </div>

      {/* Logo Text */}
      <div className={`${textSizes[size]} font-bold text-cyan-600 transition-all duration-300 group-hover:scale-105`}>
        D_ARENA
      </div>
    </div>
  );
}