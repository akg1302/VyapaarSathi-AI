"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
export function ThemeToggle() { const { theme, setTheme } = useTheme(); return <button aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"><Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"/><Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100"/></button>; }
