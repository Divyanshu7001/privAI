import React from "react";

function Input({ label, helper, required, ...props }) {
  return (
    <label className="block text-sm text-slate-200 space-y-1">
      {label && (
        <span>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </span>
      )}
      <input
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        required={required}
        {...props}
      />
      {helper && (
        <span className="block text-xs text-slate-400">{helper}</span>
      )}
    </label>
  );
}

export default Input;
