"use client";
import { useState } from "react";
import { Field, TextInput } from "../ui";
import { Plus, X } from "lucide-react";

interface Competitor {
  id: string;
  businessName: string;
  profile: string;
}

interface Reference {
  id: string;
  link: string;
  notes: string;
}

interface CompetitorsReferencesTabProps {
  competitors: Competitor[];
  setCompetitors: (v: Competitor[]) => void;
  references: Reference[];
  setReferences: (v: Reference[]) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

export function CompetitorsReferencesTab({
  competitors,
  setCompetitors,
  references,
  setReferences,
  saving,
  fieldErrors = {},
}: CompetitorsReferencesTabProps) {
  const [competitorForm, setCompetitorForm] = useState({
    businessName: "",
    profile: "",
  });

  const [referenceForm, setReferenceForm] = useState({
    link: "",
    notes: "",
  });

  const handleAddCompetitor = () => {
    if (competitorForm.businessName.trim() || competitorForm.profile.trim()) {
      setCompetitors([
        ...competitors,
        {
          id: Math.random().toString(36).substr(2, 9),
          businessName: competitorForm.businessName,
          profile: competitorForm.profile,
        },
      ]);
      setCompetitorForm({ businessName: "", profile: "" });
    }
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors(competitors.filter((c) => c.id !== id));
  };

  const handleAddReference = () => {
    if (referenceForm.link.trim() || referenceForm.notes.trim()) {
      setReferences([
        ...references,
        {
          id: Math.random().toString(36).substr(2, 9),
          link: referenceForm.link,
          notes: referenceForm.notes,
        },
      ]);
      setReferenceForm({ link: "", notes: "" });
    }
  };

  const handleDeleteReference = (id: string) => {
    setReferences(references.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 w-full">
      {/* Competitors Section */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-[#0a0a0b] mb-1">Competitors</h3>
          <p className="text-sm text-[#505056]">Business accounts you compete with</p>
        </div>

        {/* Existing Competitors */}
        {competitors.length > 0 && (
          <div className="space-y-3 mb-6">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="grid grid-cols-2 gap-4 items-end"
              >
                <Field label="Business name">
                  <div className="relative">
                    <input
                      type="text"
                      value={competitor.businessName}
                      disabled
                      className="w-full rounded-lg border border-[#d3d3d6] bg-[#f4f4f5] px-3 py-2.5 text-base text-[#0a0a0b] outline-none cursor-not-allowed"
                    />
                  </div>
                </Field>

                <div className="flex gap-2">
                  <Field label="Profile or website" className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={competitor.profile}
                        disabled
                        className="w-full rounded-lg border border-[#d3d3d6] bg-[#f4f4f5] px-3 py-2.5 text-base text-[#0a0a0b] outline-none cursor-not-allowed"
                      />
                    </div>
                  </Field>
                  <button
                    type="button"
                    onClick={() => handleDeleteCompetitor(competitor.id)}
                    disabled={saving}
                    className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50 flex-none"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Competitor Form */}
        <div className="grid grid-cols-2 gap-4 items-end">
          <Field label="Business name">
            <TextInput
              type="text"
              placeholder="Stumptown Coffee"
              value={competitorForm.businessName}
              onChange={(e) =>
                setCompetitorForm({
                  ...competitorForm,
                  businessName: e.target.value,
                })
              }
              disabled={saving}
            />
          </Field>

          <div className="flex gap-2">
            <Field label="Profile or website" className="flex-1">
              <TextInput
                type="url"
                placeholder="instagram.com/stumptowncoffee"
                value={competitorForm.profile}
                onChange={(e) =>
                  setCompetitorForm({
                    ...competitorForm,
                    profile: e.target.value,
                  })
                }
                disabled={saving}
              />
            </Field>
            <button
              type="button"
              onClick={handleAddCompetitor}
              disabled={
                saving ||
                (!competitorForm.businessName.trim() &&
                  !competitorForm.profile.trim())
              }
              className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50 flex-none"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddCompetitor}
          disabled={
            saving ||
            (!competitorForm.businessName.trim() &&
              !competitorForm.profile.trim())
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#0a0a0b] hover:text-[#505056] disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#d3d3d6]" />

      {/* Reference Content Section */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-[#0a0a0b] mb-1">Reference Content</h3>
          <p className="text-sm text-[#505056]">
            Links to posts or videos with the editing style, pacing, or format you want.
          </p>
        </div>

        {/* Existing References */}
        {references.length > 0 && (
          <div className="space-y-3 mb-6">
            {references.map((reference) => (
              <div
                key={reference.id}
                className="grid grid-cols-2 gap-4 items-end"
              >
                <Field label="Link">
                  <div className="relative">
                    <input
                      type="url"
                      value={reference.link}
                      disabled
                      className="w-full rounded-lg border border-[#d3d3d6] bg-[#f4f4f5] px-3 py-2.5 text-base text-[#0a0a0b] outline-none cursor-not-allowed"
                    />
                  </div>
                </Field>

                <div className="flex gap-2">
                  <Field label="What to take from it" className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={reference.notes}
                        disabled
                        className="w-full rounded-lg border border-[#d3d3d6] bg-[#f4f4f5] px-3 py-2.5 text-base text-[#0a0a0b] outline-none cursor-not-allowed"
                      />
                    </div>
                  </Field>
                  <button
                    type="button"
                    onClick={() => handleDeleteReference(reference.id)}
                    disabled={saving}
                    className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50 flex-none"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Reference Form */}
        <div className="grid grid-cols-2 gap-4 items-end">
          <Field label="Link">
            <TextInput
              type="url"
              placeholder="https://instagram.com/reel/CBXyz"
              value={referenceForm.link}
              onChange={(e) =>
                setReferenceForm({
                  ...referenceForm,
                  link: e.target.value,
                })
              }
              disabled={saving}
            />
          </Field>

          <div className="flex gap-2">
            <Field label="What to take from it" className="flex-1">
              <TextInput
                type="text"
                placeholder="Fast cuts, captions on every line"
                value={referenceForm.notes}
                onChange={(e) =>
                  setReferenceForm({
                    ...referenceForm,
                    notes: e.target.value,
                  })
                }
                disabled={saving}
              />
            </Field>
            <button
              type="button"
              onClick={handleAddReference}
              disabled={
                saving ||
                (!referenceForm.link.trim() && !referenceForm.notes.trim())
              }
              className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50 flex-none"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddReference}
          disabled={
            saving ||
            (!referenceForm.link.trim() && !referenceForm.notes.trim())
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#0a0a0b] hover:text-[#505056] disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Reference
        </button>
      </div>
    </div>
  );
}
