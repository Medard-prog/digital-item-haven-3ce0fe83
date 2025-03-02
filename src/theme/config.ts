
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom purple color scheme
export const purpleColors = {
  primary: {
    light: "#a78bfa", // Lighter purple
    DEFAULT: "#8b5cf6", // Main purple
    dark: "#7c3aed"  // Darker purple
  },
  background: {
    light: "#f5f3ff",
    DEFAULT: "#faf5ff",
    dark: "#1e1b4b"
  },
  glass: {
    light: "rgba(255, 255, 255, 0.6)",
    DEFAULT: "rgba(255, 255, 255, 0.4)",
    dark: "rgba(30, 27, 75, 0.2)"
  }
};
