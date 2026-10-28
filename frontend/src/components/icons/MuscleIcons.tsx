import React from "react";

interface MuscleIconProps {
  className?: string;
}

/**
 * 🍑 Mông Săn Chắc / Glutes & Hips
 * Sleek athletic gluteal & hip contours with central gluteal fold and waistline.
 */
export const GlutesIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Hips and Gluteal contour */}
    <path
      d="M5 5c2-2 5-2.5 7-1 2-1.5 5-1 7 1 1 3 .5 6.5-1.5 10-1.8 3.2-3.8 5-5.5 5.5-1.7-.5-3.7-2.3-5.5-5.5C4.5 11.5 4 8 5 5z"
      fill="currentColor"
      fillOpacity="0.14"
    />
    {/* Gluteal cleft / center line */}
    <path d="M12 4v16.5" />
    {/* Left glute lower cheek curve */}
    <path d="M6.5 11.5c1.5 2 3.5 3 5.5 3" />
    {/* Right glute lower cheek curve */}
    <path d="M17.5 11.5c-1.5 2-3.5 3-5.5 3" />
    {/* Athletic waist top contour */}
    <path d="M8 5c1.5.5 6.5.5 8 0" strokeDasharray="1.5 2" />
  </svg>
);

/**
 * 🦵 Đùi Thon Gọn / Legs & Quads
 * Athletic thighs & calves showing quad muscle lines and knees.
 */
export const LegsIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Pelvis/Hips base */}
    <path d="M6 3h12" />
    {/* Left Leg Quads and Calf */}
    <path
      d="M6 3c-.5 4-1 8 0 11 .7 2 0 4-.5 7h3.5c1-3 0-6 .5-9 .5-3 1.5-6 2.5-9"
      fill="currentColor"
      fillOpacity="0.14"
    />
    {/* Right Leg Quads and Calf */}
    <path
      d="M18 3c.5 4 1 8 0 11-.7 2 0 4 .5 7h-3.5c-1-3 0-6-.5-9-.5-3-1.5-6-2.5-9"
      fill="currentColor"
      fillOpacity="0.14"
    />
    {/* Knee markers */}
    <circle cx="8" cy="14" r="1" fill="currentColor" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
  </svg>
);

/**
 * 🧘 Bụng & Eo Thon / Core & Abs
 * Hourglass waist with distinct 6-pack abdominal grid & obliques.
 */
export const CoreIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Toned waist contour */}
    <path
      d="M5 3.5c2 3.5 1 7-1 17h16c-2-10-3-13.5-1-17H5z"
      fill="currentColor"
      fillOpacity="0.12"
    />
    {/* Linea alba (center vertical line) */}
    <path d="M12 4v16" />
    {/* Upper abs intersection */}
    <path d="M8 7.5c2 .8 6 .8 8 0" />
    {/* Middle abs intersection */}
    <path d="M7.5 11.5c2.5 1 6.5 1 9 0" />
    {/* Lower abs intersection */}
    <path d="M8 15.5c2 .8 6 .8 8 0" />
    {/* Navel */}
    <circle cx="12" cy="17.5" r="0.75" fill="currentColor" />
  </svg>
);

/**
 * 🏹 Lưng Gợi Cảm / Back & V-Taper
 * Athletic V-Taper silhouette with spine and latissimus dorsi muscle sweeps.
 */
export const BackIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* V-Taper back silhouette */}
    <path
      d="M3 4.5h18l-5 15.5H8L3 4.5z"
      fill="currentColor"
      fillOpacity="0.12"
    />
    {/* Spine line */}
    <path d="M12 4v16" />
    {/* Scapula / Shoulder blades */}
    <path d="M6 7.5c2.5 1.5 4.5 3 6 3" />
    <path d="M18 7.5c-2.5 1.5-4.5 3-6 3" />
    {/* Latissimus dorsi wing curves */}
    <path d="M7.5 12.5c2 1 3.5 2.5 4.5 4" />
    <path d="M16.5 12.5c-2 1-3.5 2.5-4.5 4" />
  </svg>
);

/**
 * 💎 Ngực Nở Nang / Chest & Pectorals
 * Clavicle and symmetrical pectoralis major muscle contours.
 */
export const ChestIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Clavicle / Collarbone */}
    <path d="M4 6.5c3 1 5 1 8 0 3 1 5 1 8 0" />
    {/* Left Pec */}
    <path
      d="M12 7c-1.5 4-4 7-8 7-1 0-1.5-2-1.5-4 0-1.8 1-3 2-3.5"
      fill="currentColor"
      fillOpacity="0.15"
    />
    {/* Right Pec */}
    <path
      d="M12 7c1.5 4 4 7 8 7 1 0 1.5-2 1.5-4 0-1.8-1-3-2-3.5"
      fill="currentColor"
      fillOpacity="0.15"
    />
    {/* Sternum center line */}
    <path d="M12 7v11.5" />
    {/* Lower chest arch */}
    <path d="M6 18c2.5 1 9.5 1 12 0" strokeDasharray="1.5 2" />
  </svg>
);

/**
 * ⚡ Vai Thon Đẹp / Shoulders & Deltoids
 * Broad deltoid caps, trapezius slopes, and athletic shoulder line.
 */
export const ShouldersIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Neck */}
    <path d="M10 3.5v3m4-3v3" />
    {/* Trapezius slope */}
    <path d="M10 6.5c-2 1-4 2-6 2.5" />
    <path d="M14 6.5c2 1 4 2 6 2.5" />
    {/* Left Deltoid cap */}
    <path
      d="M4 9C2 10 1.5 12.5 2.5 15c.8 2 2 3 3.5 3.5l1.5-3.5"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Right Deltoid cap */}
    <path
      d="M20 9c2 1 2.5 3.5 1.5 6-.8 2-2 3-3.5 3.5l-1.5-3.5"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Clavicle & Chest connection */}
    <path d="M7 14.5c1.5 1.5 3 2 5 2s3.5-.5 5-2" />
  </svg>
);

/**
 * 💪 Bắp Tay Thon / Biceps Flex
 * Powerful athletic flexed arm with prominent bicep peak and forearm.
 */
export const ArmsIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Flexed Bicep & Arm contour */}
    <path
      d="M4 14.5c1-2 2-3 4-3 1.8 0 3-1.5 3.5-3 .6-1.8 1.5-3 3.5-3 1.5 0 2.5.8 3 2l1.5 4.5c.5 1.5 1.5 2.5 3 3l-1.5 4c-2 0-4-1-5.5-2.5-1.5 1-3.5 1.5-6 1.5-2 0-4-.5-5.5-1.5L4 14.5z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    {/* Bicep peak muscle crest line */}
    <path d="M11 9c1.5-1.5 3-1.5 4 0" />
    {/* Forearm definition line */}
    <path d="M14 12.5l2 4" />
  </svg>
);

/**
 * 🌟 Toàn Thân Năng Động / Full Body Athlete
 * Athletic full-body silhouette in active stance radiating energy.
 */
export const FullBodyIcon: React.FC<MuscleIconProps> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Head */}
    <circle cx="12" cy="4" r="2" fill="currentColor" fillOpacity="0.2" />
    {/* Athletic Torso with V-Taper */}
    <path
      d="M8 8h8l-1.5 6h-5L8 8z"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Outstretched athletic arms */}
    <path d="M8 8.5L4.5 11M16 8.5l3.5 2.5" />
    {/* Athletic stance legs */}
    <path d="M9.5 14L8 21.5M14.5 14l1.5 7.5" />
    {/* Core energy cross */}
    <path d="M12 11v2m-1-1h2" strokeWidth="1.5" />
    {/* Energy bursts */}
    <circle cx="3.5" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="20.5" cy="5.5" r="0.75" fill="currentColor" />
  </svg>
);
