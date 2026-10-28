"use client";
import { Field, TextArea } from "../ui";

interface TargetAudienceTabProps {
  targetAudience: string;
  setTargetAudience: (v: string) => void;
  saving: boolean;
}

export function TargetAudienceTab({
  targetAudience,
  setTargetAudience,
  saving,
}: TargetAudienceTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-[#0a0a0b] mb-4">Target Audience</h3>
        <Field
          label="Target Audience Description *"
          hint="Who are you trying to reach with your content?"
        >
          <TextArea
            placeholder="Describe your ideal audience. Include demographics, interests, pain points, and what they value..."
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={saving}
            className="min-h-32"
          />
        </Field>
      </div>
    </div>
  );
}
