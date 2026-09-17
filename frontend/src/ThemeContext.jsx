import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0F1720" : "#F7F8FA";
    document.body.style.color = darkMode ? "#E5E7EB" : "#1F2937";
  }, [darkMode]);

  const colors = darkMode
  ? {
      bg: "#0F1720",
      card: "#1A2332",
      text: "#E5E7EB",
      subtext: "#9CA3AF",
      border: "#2D3748",
      navy: "#2C4F80",
      gold: "#F5A623",
      heading: "#F5A623",
    }
  : {
      bg: "#F7F8FA",
      card: "#FFFFFF",
      text: "#1F2937",
      subtext: "#6B7280",
      border: "#E5E7EB",
      navy: "#16325C",
      gold: "#F5A623",
      heading: "#16325C",
    };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
