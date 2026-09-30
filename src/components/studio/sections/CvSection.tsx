"use client";

import { useRef, useState } from "react";
import { CheckCircle, FilePdf, LockSimple, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { formatDay } from "@/lib/dates";
import { todayIso } from "@/lib/studio-store";
import { CheckoutModal } from "../CheckoutModal";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

const MAX_BYTES = 5 * 1024 * 1024;
const METHOD_LABEL = { bkash: "bKash", nagad: "Nagad", card: "Card" } as const;

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function Locked({ onUnlock }: { onUnlock: () => void }) {
  return (
    <>
      <Panel className="grid gap-5">
        <div className="flex items-start gap-3.5">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-tile bg-bg-subtle text-text-2"
          >
            <LockSimple size={24} weight="fill" />
          </span>
          <div>
            <p className="text-[17px] font-semibold text-text">Add your CV to your card</p>
            <p className="mt-1 text-sm leading-relaxed text-text-2">
              People can download your CV as a PDF straight from your card. You upload it once and
              replace it whenever it changes.
            </p>
          </div>
        </div>

        <ul className="grid gap-2 text-sm text-text-2">
          {[
            "A CV box on your card with a Download button",
            "Upload a PDF up to 5 MB, replace it any time",
            "Shows when the CV was last updated",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5">
              <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-success" aria-hidden />
              {line}
            </li>
          ))}
        </ul>

        <dl className="tabular grid gap-2 rounded-btn bg-bg-subtle p-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-text-2">Setup</dt>
            <dd className="font-medium text-text">৳500 one-time</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-2">Renewal</dt>
            <dd className="font-medium text-text">৳100 per year</dd>
          </div>
          <p className="text-[13px] text-text-3">The first renewal is one year after setup.</p>
          <div className="flex justify-between gap-4 border-t border-border-strong pt-2.5 font-semibold text-text">
            <dt>Due today</dt>
            <dd>৳500</dd>
          </div>
        </dl>

        <Button variant="primary" className="h-[52px] text-[15px]" onClick={onUnlock}>
          Unlock CV for ৳500
        </Button>
      </Panel>
    </>
  );
}

function Unlocked() {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOff, setConfirmOff] = useState(false);
  const billing = state.billing;

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      const msg = "Only PDF files can be used. Export your CV as a PDF and try again.";
      setError(msg);
      toast(msg, "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      const msg = `That file is ${formatSize(file.size)}. The limit is 5 MB, so compress the PDF and try again.`;
      setError(msg);
      toast(msg, "error");
      return;
    }
    setError(null);
    dispatch({ type: "setCvFile", file: URL.createObjectURL(file), name: file.name, size: file.size });
    toast("CV uploaded");
  }

  return (
    <>
      <Panel className="grid gap-4">
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-tile bg-bg-subtle text-accent-ink"
          >
            <FilePdf size={26} weight="fill" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-text">
              {state.cvUpload?.name ?? "Sample CV (placeholder)"}
            </p>
            <p className="text-[13px] text-text-3">
              {state.cvUpload
                ? `PDF, ${formatSize(state.cvUpload.size)}`
                : "Upload your own PDF to replace the sample."}
            </p>
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={() => input.current?.click()}
            icon={<UploadSimple size={18} weight="bold" aria-hidden />}
          >
            {state.cvUpload ? "Replace PDF" : "Upload PDF"}
          </Button>
          <input
            ref={input}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {error && (
            <p role="alert" className="mt-2 text-[13px] text-danger">
              {error}
            </p>
          )}
          <p className="mt-2 text-[13px] text-text-3">PDF only, 5 MB maximum.</p>
        </div>
        <TextField
          label="CV label"
          value={state.profile.cv.label ?? ""}
          maxLength={30}
          placeholder="Full CV"
          onChange={(label) => dispatch({ type: "updateCvLabel", label })}
          help="Shown as the title of the CV box on your card."
        />
      </Panel>

      {billing && (
        <Panel className="grid gap-4">
          <p className="text-[15px] font-semibold text-text">Billing</p>
          <dl className="tabular grid gap-2.5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-text-2">Setup paid</dt>
              <dd className="font-medium text-text">{formatDay(billing.setupPaidOn)} · ৳500</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-2">Next renewal</dt>
              <dd className="font-medium text-text">
                {billing.renewalOn ? `${formatDay(billing.nextRenewal)} · ৳100` : "Off"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-2">Payment method</dt>
              <dd className="font-medium text-text">{METHOD_LABEL[billing.method]}</dd>
            </div>
          </dl>

          {billing.renewalOn ? (
            confirmOff ? (
              <div role="alertdialog" aria-label="Confirm turning off renewal" className="pop-in rounded-btn border border-border-strong p-3">
                <p className="text-sm font-medium text-text">
                  Turn off yearly renewal? Your CV box will be hidden after{" "}
                  {formatDay(billing.nextRenewal)}.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="danger"
                    onClick={() => {
                      dispatch({ type: "setRenewal", value: false });
                      setConfirmOff(false);
                      toast("Yearly renewal turned off");
                    }}
                  >
                    Turn off
                  </Button>
                  <Button variant="secondary" onClick={() => setConfirmOff(false)}>
                    Keep renewal
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Button variant="ghost" className="-ml-2" onClick={() => setConfirmOff(true)}>
                  Turn off yearly renewal
                </Button>
              </div>
            )
          ) : (
            <div>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch({ type: "setRenewal", value: true });
                  toast("Yearly renewal turned on");
                }}
              >
                Turn on yearly renewal
              </Button>
            </div>
          )}

          <p className="text-[13px] leading-relaxed text-text-3">
            If a renewal is not paid, the CV box is hidden from your card. Your file is kept, and the
            box comes back when you renew.
          </p>
        </Panel>
      )}
    </>
  );
}

export function CvSection() {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  // The modal lives here, not in Locked, so its success screen survives the switch to Unlocked.
  const [checkout, setCheckout] = useState(false);

  return (
    <>
      {state.cvUnlocked ? <Unlocked /> : <Locked onUnlock={() => setCheckout(true)} />}
      {checkout && (
        <CheckoutModal
          onClose={() => setCheckout(false)}
          onPaid={(method) => {
            dispatch({ type: "unlockCv", method, today: todayIso() });
            toast("CV unlocked. This was a demo, no money was taken.");
          }}
        />
      )}
    </>
  );
}
