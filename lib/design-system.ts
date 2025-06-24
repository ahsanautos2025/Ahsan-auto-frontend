// Professional Two-Color Design System
export const designSystem = {
  colors: {
    primary: "#1a365d", // Deep Navy Blue
    secondary: "#2d7dd2", // Professional Blue
    // Base colors (white/black) are handled by Tailwind defaults
  },
  spacing: {
    section: "py-12",
    container: "px-6 lg:px-8",
  },
  breakpoints: {
    mobile: 640, // 1 car
    tablet: 768, // 3 cars
    desktop: 1024, // 5 cars
    large: 1280, // 10 cars
  },
} as const
