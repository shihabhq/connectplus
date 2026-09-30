"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera } from "@phosphor-icons/react";
import { TextField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { resizeImageToDataUrl } from "@/lib/image";
import { PLACEHOLDER_PHOTO } from "@/lib/studio-store";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

export function ProfileSection() {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  const p = state.profile;
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      const photo = await resizeImageToDataUrl(file, 800);
      dispatch({ type: "setPhoto", photo });
      toast("Photo updated");
    } catch (e) {
      toast(e instanceof Error ? e.message : "The photo could not be used.", "error");
    }
  }

  const hasPhoto = p.photo !== PLACEHOLDER_PHOTO;

  return (
    <>
      <Panel>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFile(e.dataTransfer.files[0]);
          }}
          className={`-m-2 flex items-center gap-4 rounded-card border border-dashed p-2 transition-colors duration-200 ${
            dragging ? "border-accent bg-accent-soft" : "border-transparent"
          }`}
        >
          <button
            type="button"
            onClick={() => input.current?.click()}
            aria-label="Change profile photo"
            className="relative h-[72px] w-[72px] shrink-0 rounded-[20px]"
          >
            <span className="block h-full w-full overflow-hidden rounded-[20px] border border-border bg-bg-subtle">
              <Image
                src={p.photo}
                alt=""
                width={144}
                height={144}
                className="h-full w-full object-cover"
              />
            </span>
            <span
              aria-hidden
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-accent-strong text-on-accent"
            >
              <Camera size={14} weight="fill" />
            </span>
          </button>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-text">Profile photo</p>
            <p className="text-[13px] leading-snug text-text-3">
              A clear, front-facing photo works best. Drop an image here or choose one.
            </p>
            <div className="mt-1 flex gap-1">
              <button
                type="button"
                onClick={() => input.current?.click()}
                className="min-h-11 rounded-btn pr-3 text-[13px] font-semibold text-accent-ink hover:underline"
              >
                Change photo
              </button>
              <button
                type="button"
                disabled={!hasPhoto}
                onClick={() => {
                  dispatch({ type: "setPhoto", photo: PLACEHOLDER_PHOTO });
                  toast("Photo removed");
                }}
                className="min-h-11 rounded-btn px-3 text-[13px] font-semibold text-text-2 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                Remove
              </button>
            </div>
          </div>
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </Panel>

      <Panel className="grid gap-4">
        <TextField
          label="Full name"
          value={p.name}
          autoComplete="name"
          onChange={(value) => dispatch({ type: "updateField", field: "name", value })}
          error={p.name.trim() ? undefined : "Enter your name so people know who you are."}
        />
        <TextField
          label="Job title"
          value={p.title}
          onChange={(value) => dispatch({ type: "updateField", field: "title", value })}
          error={p.title.trim() ? undefined : "Enter your job title, for example Sales Manager."}
        />
        <TextField
          label="Company"
          value={p.company}
          onChange={(value) => dispatch({ type: "updateField", field: "company", value })}
          error={p.company.trim() ? undefined : "Enter your company name."}
        />
        <TextField
          label="Location"
          value={p.location ?? ""}
          placeholder="Dhaka"
          onChange={(value) => dispatch({ type: "updateField", field: "location", value })}
          help="Optional. A city is enough."
        />
        <TextField
          label="Status"
          value={p.status ?? ""}
          placeholder="Open to new partnerships"
          maxLength={60}
          onChange={(value) => dispatch({ type: "updateField", field: "status", value })}
          help="Optional. Shown as a small badge under your name. Leave empty to hide it."
        />
      </Panel>
    </>
  );
}
