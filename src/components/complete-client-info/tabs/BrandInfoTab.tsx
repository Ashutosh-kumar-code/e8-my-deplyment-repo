"use client";
import { Field, TextArea, TextInput } from "../ui";

interface BrandInfoTabProps {
  brandDescription: string;
  setBrandDescription: (v: string) => void;
  brandLogoUrl: string;
  setBrandLogoUrl: (v: string) => void;
  saving: boolean;
}

export function BrandInfoTab({
  brandDescription,
  setBrandDescription,
  brandLogoUrl,
  setBrandLogoUrl,
  saving,
}: BrandInfoTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-[#0a0a0b] mb-4">Brand Information</h3>
        <div className="space-y-4">
          <Field
            label="Brand Description *"
            hint="Tell us about your brand in 2-3 sentences"
          >
            <TextArea
              placeholder="Describe your brand, mission, and what makes you unique..."
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              disabled={saving}
              className="min-h-32"
            />
          </Field>
          <Field
            label="Brand Logo URL"
            hint="Optional: Provide a URL to your brand logo"
          >
            <TextInput
              type="url"
              placeholder="https://example.com/logo.png"
              value={brandLogoUrl}
              onChange={(e) => setBrandLogoUrl(e.target.value)}
              disabled={saving}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
