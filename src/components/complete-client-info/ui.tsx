"use client";
// Design System Components — E8 Neutral Theme
// Colors: 950 #0a0a0b · 600 #505056 · 300 #b0b0b5 · 200 #d3d3d6 · 100 #e7e7e9 · 50 #f4f4f5
import * as React from "react";
import { Plus, X, Upload } from "lucide-react";
import { cn } from "@/components/ui/utils";

export const inputCls =
  "w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] placeholder:text-[#8a8a91] outline-none focus:border-[#0a0a0b]";

export function Field({
  label,
  hint,
  children,
  className,
  error,
  labelClassName,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  error?: string;
  labelClassName?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className={cn("text-sm font-medium", labelClassName || (error ? "text-red-600" : "text-[#0a0a0b]"))}>
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-red-600 leading-normal">{error}</span>}
      {hint && !error && <span className="text-xs text-[#505056] leading-normal">{hint}</span>}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
) {
  const { error, ...inputProps } = props;
  return (
    <input
      {...inputProps}
      className={cn(
        inputCls,
        error && "border-red-500 bg-red-50",
        props.className
      )}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={cn(
        inputCls,
        "resize-y leading-normal",
        props.className
      )}
    />
  );
}

export function SelectInput({
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly (string | readonly [string, string])[];
}) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(
          inputCls,
          "h-[42px] appearance-none py-0 pr-10 text-sm font-medium cursor-pointer",
          className
        )}
      >
        {options.map((o) => {
          const [v, l] = typeof o === "string" ? [o, o] : o;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0a0a0b"
        strokeWidth="1.5"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm transition-opacity",
        selected
          ? "border-[#0a0a0b] bg-[#0a0a0b] font-semibold text-white"
          : "border-[#d3d3d6] bg-white text-[#0a0a0b] hover:bg-[#f4f4f5]"
      )}
    >
      {children}
    </button>
  );
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  max,
}: {
  options: readonly T[];
  value: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <Chip
            key={o}
            selected={on}
            onClick={() =>
              onChange(
                on
                  ? value.filter((x) => x !== o)
                  : max && value.length >= max
                    ? value
                    : [...value, o]
              )
            }
          >
            {o}
          </Chip>
        );
      })}
    </div>
  );
}

export function PrimaryButton({
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0a0a0b] px-4 text-sm font-semibold text-white hover:opacity-85 disabled:bg-[#e7e7e9] disabled:text-[#b0b0b5] disabled:opacity-100 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}

export function SecondaryButton({
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#0a0a0b] bg-white px-4 text-sm font-semibold text-[#0a0a0b] hover:bg-[#f4f4f5]",
        className
      )}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-[#d3d3d6]", className)}>
      {children}
    </div>
  );
}

export function ProgressBar({
  pct,
  className,
}: {
  pct: number;
  className?: string;
}) {
  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-[#e7e7e9]", className)}>
      <div
        className="h-full bg-[#0a0a0b]"
        style={{ width: `${Math.round(pct)}%` }}
      />
    </div>
  );
}

export function FileUploadArea({
  onFilesSelected,
  accept = ".svg,.png,.jpg,.jpeg,.pdf,.ai,.eps",
  disabled = false,
}: {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  disabled?: boolean;
}) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(e.type === "dragenter" || e.type === "dragover");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (!disabled && e.dataTransfer.files) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center space-y-3 transition-colors cursor-pointer",
          isDragActive
            ? "border-[#0a0a0b] bg-[#f4f4f5]"
            : "border-[#d3d3d6] hover:border-[#0a0a0b] hover:bg-[#f4f4f5]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <div className="flex justify-center">
          <Upload className="w-6 h-6 text-[#505056]" />
        </div>
        <div>
          <p className="font-semibold text-[#0a0a0b]">Drop files here or click to browse</p>
          <p className="text-sm text-[#505056]">SVG, PNG, AI, EPS, or PDF. Transparent backgrounds preferred.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
    </>
  );
}

export function FileItem({
  name,
  size,
  icon,
  onDelete,
}: {
  name: string;
  size: string;
  icon: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 border border-[#d3d3d6] rounded-lg">
      <div className="flex-none w-10 h-10 flex items-center justify-center bg-[#f4f4f5] rounded font-bold text-xs text-[#505056]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#0a0a0b]">{name}</p>
        <p className="text-xs text-[#505056]">{size}</p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
}

export function RoleSelect({
  value,
  onChange,
  options,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          inputCls,
          "appearance-none pr-10 cursor-pointer",
          disabled && "bg-[#f4f4f5] cursor-not-allowed"
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export function FontPreview({
  fontName,
  preview,
}: {
  fontName: string;
  preview: string;
}) {
  return (
    <div className="rounded-lg border border-[#d3d3d6] p-4 space-y-2">
      <p className="text-xs text-[#505056]">Preview</p>
      <p
        className="text-xl font-bold text-[#0a0a0b]"
        style={{ fontFamily: fontName }}
      >
        {preview}
      </p>
    </div>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-[#0a0a0b]" : "bg-[#d3d3d6]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
