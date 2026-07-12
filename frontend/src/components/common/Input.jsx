import React from "react";

function Input({ label, helper, required, className = "", ...props }) {
  return (
    <label className={`block text-sm text-text-secondary space-y-1 ${className}`}>
      {label && (
        <span>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </span>
      )}
      <input
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
        required={required}
        {...props}
      />
      {helper && (
        <span className="block text-xs text-text-secondary/80">{helper}</span>
      )}
    </label>
  );
}


export default Input;
