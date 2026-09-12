"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nonegaran-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={theme === "dark"}
      className="ltr-run text-sm border border-[var(--hairline)] px-3 py-1.5 rounded-[var(--radius-control)] hover:border-[var(--accent)] transition-colors"
      style={{ direction: "rtl" }}
    >
      {theme === "light" ? "حالت شب" : "حالت روز"}
    </button>
  );
}
