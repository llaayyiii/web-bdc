import React from "react";

interface BdcDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BdcDots({ size = "md", className = "" }: BdcDotsProps) {
  const dim =
    size === "sm"
      ? "w-1.5 h-1.5"
      : size === "lg"
      ? "w-2.5 h-2.5"
      : "w-2 h-2";

  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <span className={`${dim} rounded-[1px] bg-[#095BAF] block`} title="Blue" />
      <span className={`${dim} rounded-[1px] bg-[#EA4335] block`} title="Red" />
      <span className={`${dim} rounded-[1px] bg-[#EEDD55] block`} title="Yellow" />
      <span className={`${dim} rounded-[1px] bg-[#34A853] block`} title="Green" />
    </span>
  );
}
