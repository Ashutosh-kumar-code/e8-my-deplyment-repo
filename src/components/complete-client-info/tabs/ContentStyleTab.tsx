"use client";
import { Field, TextArea } from "../ui";

interface ContentStyleTabProps {
  contentStyle: string;
  setContentStyle: (v: string) => void;
  saving: boolean;
}

export function ContentStyleTab({
  contentStyle,
  setContentStyle,
  saving,
}: ContentStyleTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-[#0a0a0b] mb-4">Content Style</h3>
        <Field
          label="Content Style Preferences *"
          hint="What visual and narrative style best represents your brand?"
        >
          <TextArea
            placeholder="Describe your preferred content style (e.g., fast-paced, cinematic, documentary-style, educational, entertaining)..."
            value={contentStyle}
            onChange={(e) => setContentStyle(e.target.value)}
            disabled={saving}
            className="min-h-32"
          />
        </Field>
      </div>
    </div>
  );
}
