import React from 'react';

export interface SprintDeskLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

export const SprintDeskLogo: React.FC<SprintDeskLogoProps> = ({
  className = '',
  iconSize = 36,
  showText = true,
}) => {
  // Generate 8 radiating pill/petal elements in a geometric sunburst layout
  const petals = Array.from({ length: 8 }).map((_, i) => {
    const angle = i * 45;
    return (
      <rect
        key={i}
        x="18"
        y="4"
        width="4"
        height="10"
        rx="2"
        fill="#728974"
        transform={`rotate(${angle} 20 20)`}
      />
    );
  });

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Radiating Geometric Sunburst Floral SVG Mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        {/* Central Hub Circle */}
        <circle cx="20" cy="20" r="5" fill="#728974" />
        {/* 8 Radiating Pill Petals */}
        {petals}
      </svg>

      {showText && (
        <span className="text-xl font-heading font-bold tracking-tight text-text-main dark:text-white">
          SprintDesk
        </span>
      )}
    </div>
  );
};
