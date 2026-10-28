"use client";
import { Field, TextInput } from "../ui";

interface BrandVoiceTabProps {
  brandVoice: string;
  setBrandVoice: (v: string) => void;
  brandValues: string;
  setBrandValues: (v: string) => void;
  tones?: string[];
  setTones?: (v: string[]) => void;
  dos?: string;
  setDos?: (v: string) => void;
  donts?: string;
  setDonts?: (v: string) => void;
  avoidWords?: string;
  setAvoidWords?: (v: string) => void;
  defaultHashtags?: string;
  setDefaultHashtags?: (v: string) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Bold",
  "Playful",
  "Educational",
  "Premium",
  "Local",
  "Technical",
] as const;

export function BrandVoiceTab({
  brandVoice,
  setBrandVoice,
  brandValues,
  setBrandValues,
  tones = [],
  setTones,
  dos = "",
  setDos,
  donts = "",
  setDonts,
  avoidWords = "",
  setAvoidWords,
  defaultHashtags = "",
  setDefaultHashtags,
  saving,
  fieldErrors = {},
}: BrandVoiceTabProps) {
  const handleToggleTone = (tone: string) => {
    if (!setTones) return;
    if (tones.includes(tone)) {
      setTones(tones.filter((t) => t !== tone));
    } else {
      if (tones.length < 3) {
        setTones([...tones, tone]);
      }
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Tone Selection */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#0a0a0b]">
            Tone — pick up to 3
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => handleToggleTone(tone)}
              disabled={
                saving ||
                (tones.length >= 3 && !tones.includes(tone))
              }
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                tones.includes(tone)
                  ? "bg-[#0a0a0b] text-white"
                  : "bg-white border border-[#d3d3d6] text-[#0a0a0b] hover:bg-[#f4f4f5] disabled:opacity-50"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Do's */}
        <Field label="Do's">
          <textarea
            placeholder="Show the team behind the counter&#10;Mention free parking"
            value={dos}
            onChange={(e) => setDos?.(e.target.value)}
            disabled={saving}
            className="w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] placeholder:text-[#8a8a91] outline-none focus:border-[#0a0a0b] resize-none"
            rows={6}
          />
        </Field>

        {/* Don'ts */}
        <Field label="Don'ts">
          <textarea
            placeholder="No trending audio with explicit lyrics"
            value={donts}
            onChange={(e) => setDonts?.(e.target.value)}
            disabled={saving}
            className="w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] placeholder:text-[#8a8a91] outline-none focus:border-[#0a0a0b] resize-none"
            rows={6}
          />
        </Field>
      </div>

      {/* Words to Avoid and Hashtags */}
      <div className="grid grid-cols-2 gap-6">
        {/* Words to Avoid */}
        <Field label="Words or claims to avoid">
          <TextInput
            type="text"
            placeholder="cheap, best in town"
            value={avoidWords}
            onChange={(e) => setAvoidWords?.(e.target.value)}
            disabled={saving}
          />
        </Field>

        {/* Default Hashtags */}
        <Field label="Default hashtags">
          <TextInput
            type="text"
            placeholder="#harborcoffee #portlandbeats"
            value={defaultHashtags}
            onChange={(e) => setDefaultHashtags?.(e.target.value)}
            disabled={saving}
          />
        </Field>
      </div>
    </div>
  );
}
