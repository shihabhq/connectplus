"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, CreditCard, Info, X } from "@phosphor-icons/react";
import { PAYMENT_COLORS } from "@/components/icons/brands";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { formatDay } from "@/lib/dates";
import { addOneYear, todayIso, type PaymentMethod } from "@/lib/studio-store";

const METHODS: { id: PaymentMethod; label: string; hint: string; mark: string }[] = [
  { id: "bkash", label: "bKash", hint: "Mobile wallet", mark: "b" },
  { id: "nagad", label: "Nagad", hint: "Mobile wallet", mark: "n" },
  { id: "card", label: "Card", hint: "Debit or credit", mark: "" },
];

type Step = "form" | "processing" | "success";

export function CheckoutModal({
  onClose,
  onPaid,
}: {
  onClose: () => void;
  onPaid: (method: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [step, setStep] = useState<Step>("form");
  const dialog = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const today = todayIso();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => {
      window.clearTimeout(timer.current);
      previous?.focus();
    };
  }, []);

  function pay() {
    setStep("processing");
    timer.current = window.setTimeout(() => {
      onPaid(method);
      setStep("success");
    }, 1200);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && step !== "processing") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialog.current) return;
    const focusable = dialog.current.querySelectorAll<HTMLElement>(
      "button:not([disabled]), input:not([disabled]), [href]",
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Portalled to body so it sits above the mobile bottom bar and every stacking context.
  return createPortal(
    <div className="fade-in fixed inset-0 z-[60] flex items-end justify-center bg-(--scrim) p-0 min-[520px]:items-center min-[520px]:p-4">
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="pop-in max-h-[92dvh] w-full max-w-[440px] overflow-y-auto rounded-t-[24px] bg-surface p-5 shadow-lg outline-none min-[520px]:rounded-[24px] min-[520px]:p-6"
      >
        {step === "success" ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle size={56} weight="fill" className="text-success" aria-hidden />
            <h2 id="checkout-title" className="mt-4 text-[22px] font-bold tracking-[-0.02em] text-text">
              CV unlocked
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-text-2">
              Your CV box is now on your card. Upload your file in the CV section.
            </p>
            <p className="mt-2 text-[13px] text-text-3">This was a demo. No money was taken.</p>
            <Button variant="primary" className="mt-6 w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 id="checkout-title" className="text-[22px] font-bold tracking-[-0.02em] text-text">
                Unlock CV
              </h2>
              <IconButton label="Close checkout" onClick={onClose} disabled={step === "processing"}>
                <X size={18} weight="bold" aria-hidden />
              </IconButton>
            </div>

            <p className="mt-3 flex gap-2.5 rounded-btn bg-bg-subtle p-3 text-[13px] leading-relaxed text-text-2">
              <Info size={18} weight="fill" className="mt-px shrink-0 text-text-3" aria-hidden />
              This is a demo checkout. No money is taken and no card details are asked for.
            </p>

            <dl className="tabular mt-5 grid gap-2.5 text-[15px]">
              <div className="flex justify-between gap-4 text-text-2">
                <dt>CV add-on, one-time setup</dt>
                <dd className="font-medium text-text">৳500</dd>
              </div>
              <div className="flex justify-between gap-4 text-[13px] text-text-3">
                <dt>Yearly renewal from {formatDay(addOneYear(today))}</dt>
                <dd>৳100 / year</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3 font-semibold text-text">
                <dt>Due today</dt>
                <dd>৳500</dd>
              </div>
            </dl>

            <fieldset className="mt-5" disabled={step === "processing"}>
              <legend className="mb-2 text-[13px] font-semibold text-text">Payment method</legend>
              <div className="grid gap-2">
                {METHODS.map((m) => {
                  const selected = method === m.id;
                  return (
                    <label
                      key={m.id}
                      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-btn border p-3 transition-colors duration-200 ${
                        selected ? "border-text bg-bg-subtle" : "border-border-strong hover:bg-bg-subtle"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={m.id}
                        checked={selected}
                        onChange={() => setMethod(m.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-tile text-base font-bold text-white"
                        style={{ background: PAYMENT_COLORS[m.id] }}
                      >
                        {m.id === "card" ? <CreditCard size={20} weight="fill" /> : m.mark}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[15px] font-semibold text-text">{m.label}</span>
                        <span className="block text-[13px] text-text-3">{m.hint}</span>
                      </span>
                      <span
                        aria-hidden
                        className={`h-5 w-5 rounded-full border-2 ${
                          selected ? "border-text bg-text shadow-[inset_0_0_0_3px_var(--surface)]" : "border-border-strong"
                        }`}
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Button variant="primary" className="mt-6 h-[52px] w-full text-[15px]" onClick={pay} disabled={step === "processing"}>
              {step === "processing" ? (
                <>
                  <span className="spin h-4 w-4 rounded-full border-2 border-current border-t-transparent" aria-hidden />
                  <span role="status">Processing...</span>
                </>
              ) : (
                "Pay ৳500"
              )}
            </Button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
