import React from "react";
import { FiSettings } from "react-icons/fi";

export const Header = ({ themeStyles, isLight, setThemeOpen }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-semibold tracking-wide">privAI</span>
        <p className={themeStyles.tagline}>
          protecting data , making you aware
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setThemeOpen((prev) => !prev)}
          className={
            isLight
              ? "flex h-8 w-8 items-center justify-center rounded-full border border-black/50 bg-gray/20 text-xs text-zinc-700 shadow-sm hover:bg-rose-100"
              : "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs text-zinc-200 shadow-sm hover:bg-black/60"
          }
          aria-label="Change theme"
        >
          <FiSettings className="h-4 w-4" />
        </button>
        <div className="relative group">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 text-xs font-semibold text-zinc-900 shadow-md"
          >
            P
          </button>
          <div className="invisible absolute right-0 z-10 top-full w-40 rounded-xl border border-white/10 bg-zinc-900/95 p-1 text-xs text-zinc-100 opacity-0 shadow-lg ring-1 ring-black/40 transition duration-150 group-hover:visible group-hover:opacity-100">
            <a
              href="https://example.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-zinc-800/80"
            >
              Dashboard
            </a>
            <a
              href="https://example.com/profile"
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 flex w-full cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-zinc-800/80"
            >
              Profile settings
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
