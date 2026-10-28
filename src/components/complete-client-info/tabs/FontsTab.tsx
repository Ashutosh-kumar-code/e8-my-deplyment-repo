"use client";
import { useState } from "react";
import { Field, TextInput, SelectInput, ToggleSwitch, FontPreview } from "../ui";
import { Upload, X } from "lucide-react";

interface FontConfig {
  name: string;
  link: string;
  weight: string;
}

interface FontsTabProps {
  primaryFont: FontConfig | null;
  setPrimaryFont: (v: FontConfig | null) => void;
  bodyFont: FontConfig | null;
  setBodyFont: (v: FontConfig | null) => void;
  customFonts: File[];
  setCustomFonts: (v: File[]) => void;
  noBrandFonts: boolean;
  setNoBrandFonts: (v: boolean) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

const FONT_WEIGHTS = [
  "100 Thin",
  "200 Extra Light",
  "300 Light",
  "400 Regular",
  "500 Medium",
  "600 Semi Bold",
  "700 Bold",
  "800 Extra Bold",
  "900 Black",
] as const;

const SAMPLE_PREVIEW = "Fresh roast, every morning";

export function FontsTab({
  primaryFont,
  setPrimaryFont,
  bodyFont,
  setBodyFont,
  customFonts,
  setCustomFonts,
  noBrandFonts,
  setNoBrandFonts,
  saving,
  fieldErrors = {},
}: FontsTabProps) {
  const [showFileInput, setShowFileInput] = useState(false);

  const handleAddCustomFonts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCustomFonts([...customFonts, ...Array.from(e.target.files)]);
      setShowFileInput(false);
    }
  };

  const handleRemoveCustomFont = (index: number) => {
    setCustomFonts(customFonts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 w-full">
      {/* No Brand Fonts Toggle */}
      <div className="flex items-center gap-3">
        <ToggleSwitch
          checked={noBrandFonts}
          onChange={setNoBrandFonts}
          disabled={saving}
        />
        <label className={`text-sm ${fieldErrors.fonts ? 'text-red-600' : 'text-[#505056]'}`}>
          We don't have brand fonts. EB selects fonts that match the brand.
        </label>
        {fieldErrors.fonts && (
          <p className="text-sm text-red-600 ml-auto">{fieldErrors.fonts}</p>
        )}
      </div>

      {!noBrandFonts && (
        <>
          {/* Heading Font */}
          <div className="border border-[#d3d3d6] rounded-lg p-6 space-y-6">
            <h3 className="font-semibold text-[#0a0a0b]">Heading font *</h3>

            <Field label="Font name *" labelClassName={primaryFont?.name?.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
              <TextInput
                type="text"
                placeholder="Montserrat"
                value={primaryFont?.name || ""}
                onChange={(e) =>
                  setPrimaryFont({
                    ...primaryFont,
                    name: e.target.value,
                    link: primaryFont?.link || "",
                    weight: primaryFont?.weight || "700 Bold",
                  })
                }
                disabled={saving}
              />
            </Field>

            <Field label="Font link *" hint="Link to Google Fonts or similar" labelClassName={primaryFont?.link?.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
              <TextInput
                type="url"
                placeholder="https://fonts.google.com/specimen/Montserrat"
                value={primaryFont?.link || ""}
                onChange={(e) =>
                  setPrimaryFont({
                    ...primaryFont,
                    name: primaryFont?.name || "",
                    link: e.target.value,
                    weight: primaryFont?.weight || "700 Bold",
                  })
                }
                disabled={saving}
              />
            </Field>

            <Field label="Weight">
              <SelectInput
                options={FONT_WEIGHTS}
                value={primaryFont?.weight || "700 Bold"}
                onChange={(e) =>
                  setPrimaryFont({
                    ...primaryFont,
                    name: primaryFont?.name || "",
                    link: primaryFont?.link || "",
                    weight: e.target.value,
                  })
                }
                disabled={saving}
              />
              <p className="text-xs text-[#505056] mt-1">
                Google Fonts: {primaryFont?.name} — preview loaded
              </p>
            </Field>

            {/* Preview */}
            <FontPreview fontName={primaryFont?.name || "serif"} preview={SAMPLE_PREVIEW} />
          </div>

          {/* Body Font */}
          <div className="border border-[#d3d3d6] rounded-lg p-6 space-y-6">
            <h3 className="font-semibold text-[#0a0a0b]">Body font *</h3>

            <Field label="Font name *" labelClassName={bodyFont?.name?.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
              <TextInput
                type="text"
                placeholder="Open Sans"
                value={bodyFont?.name || ""}
                onChange={(e) =>
                  setBodyFont({
                    ...bodyFont,
                    name: e.target.value,
                    link: bodyFont?.link || "",
                    weight: bodyFont?.weight || "400 Regular",
                  })
                }
                disabled={saving}
              />
            </Field>

            <Field label="Font link *" hint="Link to Google Fonts or similar" labelClassName={bodyFont?.link?.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
              <TextInput
                type="url"
                placeholder="https://fonts.google.com/specimen/Open+Sans"
                value={bodyFont?.link || ""}
                onChange={(e) =>
                  setBodyFont({
                    ...bodyFont,
                    name: bodyFont?.name || "",
                    link: e.target.value,
                    weight: bodyFont?.weight || "400 Regular",
                  })
                }
                disabled={saving}
              />
            </Field>

            <Field label="Weight">
              <SelectInput
                options={FONT_WEIGHTS}
                value={bodyFont?.weight || "400 Regular"}
                onChange={(e) =>
                  setBodyFont({
                    ...bodyFont,
                    name: bodyFont?.name || "",
                    link: bodyFont?.link || "",
                    weight: e.target.value,
                  })
                }
                disabled={saving}
              />
              <p className="text-xs text-[#505056] mt-1">
                Google Fonts: {bodyFont?.name} — preview loaded
              </p>
            </Field>

            {/* Preview */}
            <FontPreview fontName={bodyFont?.name || "sans-serif"} preview={SAMPLE_PREVIEW} />
          </div>
        </>
      )}

      {/* Custom Font Files */}
      <div className="space-y-4">
        <h3 className="font-semibold text-[#0a0a0b]">Font files (optional — OTF, TTF, WOFF)</h3>

        {/* Uploaded Fonts */}
        {customFonts.length > 0 && (
          <div className="space-y-2">
            {customFonts.map((font, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-[#f4f4f5] rounded-lg"
              >
                <span className="text-xs font-medium text-[#505056]">
                  {font.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomFont(idx)}
                  disabled={saving}
                  className="ml-auto p-1 hover:bg-white rounded cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {!showFileInput ? (
          <button
            type="button"
            onClick={() => setShowFileInput(true)}
            disabled={saving}
            className="px-4 py-2 border border-[#0a0a0b] text-[#0a0a0b] rounded-lg font-semibold hover:bg-[#f4f4f5] cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Font Files
          </button>
        ) : (
          <input
            type="file"
            multiple
            accept=".otf,.ttf,.woff,.woff2"
            onChange={handleAddCustomFonts}
            disabled={saving}
            autoFocus
            className="block w-full text-sm text-[#505056]
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-[#0a0a0b] file:text-white
              hover:file:bg-[#0a0a0b]/90"
          />
        )}
      </div>
    </div>
  );
}
