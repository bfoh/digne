"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { CONTACT_TOPICS, contactMessage, contactSchema, type ContactInput } from "@/lib/enquiry-forms";
import { whatsappHref } from "@/lib/whatsapp";
import { useUI } from "@/stores/ui";

import { Field } from "./Field";
import { HandoffNotice, openWhatsApp } from "./HandoffNotice";

/** Writes a message for WhatsApp. Nothing is sent from this site. */
export function ContactForm() {
  const announce = useUI((s) => s.announce);
  const [sent, setSent] = useState<{ href: string; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", topic: undefined, message: "" },
  });

  const onValid = (values: ContactInput) => {
    const message = contactMessage(values);
    const href = whatsappHref(message);
    openWhatsApp(href);
    setSent({ href, message });
  };

  const onInvalid = (errs: object) => {
    const n = Object.keys(errs).length;
    announce(`Please check ${n} ${n === 1 ? "field" : "fields"}`);
  };

  if (sent) {
    return (
      <HandoffNotice href={sent.href} message={sent.message} title="Your message is waiting to be sent." onReset={() => setSent(null)}>
        <p>WhatsApp has opened with your message filled in — press send there to reach the showroom.</p>
        <p className="text-muted">If it didn’t open, use the button below, copy the message, or call instead.</p>
      </HandoffNotice>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="grid gap-8">
      <Field id="contact-name" label="Your name" error={errors.name?.message}>
        {(control) => <input {...control} {...register("name")} type="text" autoComplete="name" className="field-input" />}
      </Field>

      <Field id="contact-topic" label="About" error={errors.topic?.message}>
        {(control) => (
          <span className="relative block">
            <select {...control} {...register("topic")} defaultValue="" className="field-input cursor-pointer appearance-none pr-10">
              <option value="" disabled>
                Choose a topic
              </option>
              {CONTACT_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-2 -translate-y-3/4 rotate-45 border-r border-b border-current" />
          </span>
        )}
      </Field>

      <Field id="contact-message" label="Message" error={errors.message?.message} hint="Mention the piece, size or date you have in mind — photos can be added in WhatsApp.">
        {(control) => <textarea {...control} {...register("message")} rows={6} className="field-input resize-y" />}
      </Field>

      <div className="grid gap-4">
        <button type="submit" className="btn btn-block sm:w-auto sm:justify-self-start">
          Continue in WhatsApp <span className="arrow" aria-hidden>↗</span>
        </button>
        <p className="text-xs leading-relaxed text-muted">This opens WhatsApp with your message ready to send. Nothing is stored or sent by this website.</p>
      </div>
    </form>
  );
}
