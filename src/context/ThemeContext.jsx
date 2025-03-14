"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create a ThemeContext with default undefined value.
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  // Set the initial theme to "light". We use useEffect below to update it
  // once the component is mounted so that we safely access window and localStorage.
  const [theme, setTheme] = useState("light");

  // On mount, check for a saved theme or system preference.
  useEffect(() => {
    // Check localStorage for a saved theme.
    const savedTheme = localStorage.getItem("theme");
    // Use saved theme if available; otherwise, use the system preference.
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  // Update the document's class and localStorage when theme changes.
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save the user's preference in localStorage.
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between "light" and "dark" themes.
  const toggleTheme = () => {
    console.log("Toggling theme");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to easily access the theme context.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
