"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";
import { MAX_QUANTITY } from "@/stores/bag";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  size?: "md" | "sm";
  className?: string;
}

/** − 1 + in a bordered box. The number stays editable for keyboard users. */
export function QuantityStepper({ value, onChange, label, size = "md", className }: QuantityStepperProps) {
  const set = (n: number) => onChange(Math.max(1, Math.min(MAX_QUANTITY, Number.isFinite(n) ? Math.round(n) : 1)));
  const cell = size === "sm" ? "size-9" : "size-11";
  return (
    <div role="group" aria-label={label} className={cn("inline-grid grid-cols-[auto_auto_auto] items-center border hairline", className)}>
      <button type="button" className={cn(cell, "grid place-items-center transition-opacity hover:opacity-60 disabled:opacity-30")} onClick={() => set(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus aria-hidden className="size-3.5" strokeWidth={1.3} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QUANTITY}
        value={value}
        onChange={(e) => set(e.currentTarget.valueAsNumber)}
        aria-label="Quantity"
        className={cn("w-9 [appearance:textfield] bg-transparent text-center text-sm tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none", size === "sm" && "w-7")}
      />
      <button type="button" className={cn(cell, "grid place-items-center transition-opacity hover:opacity-60 disabled:opacity-30")} onClick={() => set(value + 1)} disabled={value >= MAX_QUANTITY} aria-label="Increase quantity">
        <Plus aria-hidden className="size-3.5" strokeWidth={1.3} />
      </button>
    </div>
  );
}
