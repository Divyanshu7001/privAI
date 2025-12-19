import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ label, helper, required, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block text-sm text-slate-200 space-y-1">
      {label && (
        <span>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </span>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 pr-10 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          required={required}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {helper && (
        <span className="block text-xs text-slate-400">{helper}</span>
      )}
    </label>
  );
}

export default PasswordInput;

