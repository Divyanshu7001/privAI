import React from "react";

function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950 hover:brightness-110 focus:ring-brand",
    outline:
      "border border-border text-text-primary hover:bg-border/30 focus:ring-brand",
    ghost:
      "text-text-secondary hover:bg-border/30 hover:text-text-primary focus:ring-brand",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


export default Button;
