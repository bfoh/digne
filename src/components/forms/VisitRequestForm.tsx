"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { resolveLines } from "@/components/product/bag-message";
import { useHydrated } from "@/hooks/useHydrated";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { formatVisitDate, PARTY_SIZES, todayISO, VISIT_OCCASIONS, VISIT_TIMES, visitMessage, visitSchema, type VisitInput } from "@/lib/enquiry-forms";
import { describePiece, whatsappHref } from "@/lib/whatsapp";
import { useBag } from "@/stores/bag";
import { useUI } from "@/stores/ui";

import { ChoiceGroup, Field } from "./Field";
import { HandoffNotice, openWhatsApp } from "./HandoffNotice";

/**
 * Requests a showroom visit through WhatsApp. The request is only a request:
 * the confirmation copy never says a visit is booked.
 */
export function VisitRequestForm({ pieces }: { pieces: PieceSummary[] }) {
  const hydrated = useHydrated();
  const announce = useUI((s) => s.announce);
  const lines = useBag((s) => s.lines);
  const bySlug = useMemo(() => new Map(pieces.map((p) => [p.slug, p])), [pieces]);
  const bagPieces = hydrated ? resolveLines(lines, bySlug).map(({ line, piece }) => describePiece({ name: piece.name, ...line })) : [];
  const [sent, setSent] = useState<{ href: string; message: string; date: string; time: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitInput>({
    resolver: zodResolver(visitSchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", date: "", includeBag: true, notes: "" },
  });

  // Registered in visual order: react-hook-form focuses the first invalid field in this order.
  const fields = {
    name: register("name"),
    phone: register("phone"),
    date: register("date"),
    time: register("time"),
    occasion: register("occasion"),
    party: register("party"),
    includeBag: register("includeBag"),
    notes: register("notes"),
  };

  const onValid = (values: VisitInput) => {
    const message = visitMessage(values, bagPieces);
    const href = whatsappHref(message);
    openWhatsApp(href);
    setSent({ href, message, date: formatVisitDate(values.date), time: values.time.toLowerCase() });
  };

  const onInvalid = (errs: object) => {
    const n = Object.keys(errs).length;
    announce(`Please check ${n} ${n === 1 ? "field" : "fields"}`);
  };

  if (sent) {
    return (
      <HandoffNotice href={sent.href} message={sent.message} title="Your request is ready to send." onReset={() => setSent(null)}>
        <p>
          WhatsApp has opened with a request for <strong className="font-medium text-charcoal">{sent.date}</strong>, {sent.time}. Press send there to reach the
          showroom.
        </p>
        <p>
          <strong className="font-medium text-charcoal">Your visit isn’t booked yet.</strong> The showroom will reply to confirm the time or suggest another.
        </p>
      </HandoffNotice>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="grid gap-9">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
        <Field id="visit-name" label="Your name" error={errors.name?.message}>
          {(control) => <input {...control} {...fields.name} type="text" autoComplete="name" className="field-input" />}
        </Field>
        <Field id="visit-phone" label="Phone" optional error={errors.phone?.message} hint="If it’s different from your WhatsApp number.">
          {(control) => <input {...control} {...fields.phone} type="tel" autoComplete="tel" inputMode="tel" className="field-input" />}
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
        <Field id="visit-date" label="Preferred date" error={errors.date?.message}>
          {(control) => <input {...control} {...fields.date} type="date" min={hydrated ? todayISO() : undefined} className="field-input" />}
        </Field>
        <ChoiceGroup
          id="visit-time"
          legend="Time of day"
          options={VISIT_TIMES}
          registration={fields.time}
          error={errors.time?.message}
          hint="The showroom confirms an exact time."
        />
      </div>

      <ChoiceGroup id="visit-occasion" legend="Dressing for" options={VISIT_OCCASIONS} registration={fields.occasion} error={errors.occasion?.message} />
      <ChoiceGroup
        id="visit-party"
        legend="Who’s coming"
        options={PARTY_SIZES}
        registration={fields.party}
        error={errors.party?.message}
        hint="Dressing a wedding party? Say so in the notes."
      />

      {bagPieces.length > 0 && (
        <fieldset className="border hairline p-5">
          <legend className="sr-only">Pieces from your enquiry bag</legend>
          <label className="flex cursor-pointer items-start gap-3.5">
            <input type="checkbox" {...fields.includeBag} className="peer sr-only" />
            <span
              aria-hidden
              className="mt-0.5 grid size-4 flex-none place-items-center border hairline peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:[&>span]:block peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]"
            >
              <span className="hidden size-1.5 bg-ivory" />
            </span>
            <span className="text-[0.95rem]">
              Include the {bagPieces.length === 1 ? "piece" : `${bagPieces.length} pieces`} in my enquiry bag
              <span className="mt-2 block text-sm text-muted">{bagPieces.join(" · ")}</span>
            </span>
          </label>
        </fieldset>
      )}

      <Field id="visit-notes" label="Anything else" optional error={errors.notes?.message} hint="The date of the occasion, colours you have in mind, sizes — whatever helps.">
        {(control) => <textarea {...control} {...fields.notes} rows={4} className="field-input resize-y" />}
      </Field>

      <div className="grid gap-4">
        <button type="submit" className="btn btn-block sm:w-auto sm:justify-self-start">
          Send request on WhatsApp <span className="arrow" aria-hidden>↗</span>
        </button>
        <p className="text-xs leading-relaxed text-muted">
          This opens WhatsApp with your request ready to send. Nothing is stored or sent by this website, and your visit is confirmed only when the showroom
          replies.
        </p>
      </div>
    </form>
  );
}
