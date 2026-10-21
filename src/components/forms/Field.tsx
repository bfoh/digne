import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/cn";

export interface ControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

const describedBy = (id: string, hint?: ReactNode, error?: string) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

function Messages({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-heritage">
          {error}
        </p>
      )}
    </>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  /** Receives the id and ARIA wiring for the control. */
  children: (control: ControlProps) => ReactNode;
}

/** A labelled control with its hint and error wired up for assistive tech. */
export function Field({ id, label, hint, error, optional, className, children }: FieldProps) {
  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <label htmlFor={id} className="eyebrow flex items-baseline justify-between gap-4">
        {label}
        {optional && <span className="text-xs tracking-normal text-muted normal-case">Optional</span>}
      </label>
      {children({ id, "aria-describedby": describedBy(id, hint, error), "aria-invalid": error ? true : undefined })}
      <Messages id={id} hint={hint} error={error} />
    </div>
  );
}

interface ChoiceGroupProps {
  id: string;
  legend: string;
  options: readonly string[];
  registration: UseFormRegisterReturn;
  hint?: ReactNode;
  error?: string;
  className?: string;
}

/** A radio group drawn as bordered option blocks. */
export function ChoiceGroup({ id, legend, options, registration, hint, error, className }: ChoiceGroupProps) {
  return (
    <fieldset aria-describedby={describedBy(id, hint, error)} className={cn("grid content-start gap-3", className)}>
      <legend className="eyebrow mb-3">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative">
            <input type="radio" value={option} {...registration} className="peer sr-only" />
            <span className="option-block">{option}</span>
          </label>
        ))}
      </div>
      <Messages id={id} hint={hint} error={error} />
    </fieldset>
  );
}
