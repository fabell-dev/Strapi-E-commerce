"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // No renderizar hasta que esté montado para evitar hidratación incorrecta
  if (!mounted) {
    return <div className="rounded-lg p-2 w-9 h-9" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 hover:bg-accent transition-colors"
      aria-label="Cambiar tema"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
