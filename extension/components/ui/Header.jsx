import React from "react";
import { FiSettings } from "react-icons/fi";

export const Header = ({ themeStyles, isLight, setThemeOpen, authData }) => {
  const userInitial = authData?.user?.name ? authData.user.name.charAt(0).toUpperCase() : "P";

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
              ? "flex h-8 w-8 items-center justify-center rounded-full border border-black/50 bg-gray/20 text-xs text-zinc-700 shadow-sm hover:bg-rose-100 transition-colors"
              : "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs text-zinc-200 shadow-sm hover:bg-black/60 transition-colors"
          }
          aria-label="Change theme"
        >
          <FiSettings className="h-4 w-4" />
        </button>

        {!authData?.isAuthenticated ? (
          <a
            href="http://localhost:5173/login"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 items-center justify-center rounded-full bg-[#6e52f6] px-3.5 text-xs font-semibold text-white shadow-md hover:bg-[#5b3fe0] transition-colors"
          >
            Log In
          </a>
        ) : (
          <div className="relative group">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-md select-none"
              title={authData.user?.name || "Profile"}
            >
              {userInitial}
            </button>
            <div className="invisible absolute right-0 z-10 top-full mt-1.5 w-40 rounded-xl border border-white/10 bg-zinc-900/95 p-1.5 text-xs text-zinc-100 opacity-0 shadow-lg ring-1 ring-black/40 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <a
                href="http://localhost:5173/dashboard"
                target="_blank"
                rel="noreferrer"
                className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-zinc-800/80 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="http://localhost:5173/dashboard"
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 flex w-full cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-zinc-800/80 transition-colors"
              >
                Profile settings
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
