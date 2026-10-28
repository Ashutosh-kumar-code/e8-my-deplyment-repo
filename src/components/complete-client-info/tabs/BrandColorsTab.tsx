"use client";
import { useState, useEffect } from "react";
import { Field } from "../ui";
import { X, Plus } from "lucide-react";

interface BrandColorsTabProps {
  brandPrimaryColor: string;
  setBrandPrimaryColor: (v: string) => void;
  brandSecondaryColor: string;
  setBrandSecondaryColor: (v: string) => void;
  brandAccentColor: string;
  setBrandAccentColor: (v: string) => void;
  themePreference: string;
  setThemePreference: (v: string) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

interface ColorItem {
  hex: string;
  role: string;
}

const ROLE_OPTIONS = [
  "Primary",
  "Secondary",
  "Background",
  "Text",
  "Accent",
  "Success",
  "Warning",
  "Error",
] as const;

export function BrandColorsTab({
  brandPrimaryColor,
  setBrandPrimaryColor,
  brandSecondaryColor,
  setBrandSecondaryColor,
  brandAccentColor,
  setBrandAccentColor,
  themePreference,
  setThemePreference,
  saving,
  fieldErrors = {},
}: BrandColorsTabProps) {
  const [mode, setMode] = useState<"enter" | "upload">("enter");
  const [colors, setColors] = useState<ColorItem[]>([
    { hex: brandPrimaryColor || "#667eea", role: "Primary" },
    { hex: brandSecondaryColor || "#764ba2", role: "Secondary" },
    { hex: brandAccentColor || "#f59e0b", role: "Background" },
    { hex: "#2B2B2B", role: "Text" },
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const handleColorChange = (index: number, hex: string) => {
    const updated = [...colors];
    updated[index].hex = hex;
    setColors(updated);

    // Sync with parent state
    if (updated[0]) setBrandPrimaryColor(updated[0].hex);
    if (updated[1]) setBrandSecondaryColor(updated[1].hex);
    if (updated[2]) setBrandAccentColor(updated[2].hex);
  };

  // Sync colors when parent props change
  useEffect(() => {
    if (brandPrimaryColor && colors[0]?.hex !== brandPrimaryColor) {
      setColors(prev => [{ ...prev[0], hex: brandPrimaryColor }, prev[1], prev[2], prev[3]]);
    }
  }, [brandPrimaryColor]);

  const handleRoleChange = (index: number, role: string) => {
    const updated = [...colors];
    updated[index].role = role;
    setColors(updated);
  };

  const handleAddColor = () => {
    setColors([...colors, { hex: "#CCCCCC", role: "Accent" }]);
  };

  const handleRemoveColor = (index: number) => {
    const updated = colors.filter((_, i) => i !== index);
    setColors(updated);
  };

  const usedRoles = colors.map((c) => c.role);
  const availableRoles = ROLE_OPTIONS.filter((role) => !usedRoles.includes(role));

  return (
    <div className="space-y-8 w-full">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#d3d3d6]">
        <button
          type="button"
          onClick={() => setMode("enter")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            mode === "enter"
              ? "border-[#0a0a0b] text-[#0a0a0b]"
              : "border-transparent text-[#505056] hover:text-[#0a0a0b]"
          }`}
        >
          Enter colors
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            mode === "upload"
              ? "border-[#0a0a0b] text-[#0a0a0b]"
              : "border-transparent text-[#505056] hover:text-[#0a0a0b]"
          }`}
        >
          Upload brand guide
        </button>
      </div>

      {/* Enter Colors Mode */}
      {mode === "enter" && (
        <div className="space-y-6">
          {fieldErrors.colors && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {fieldErrors.colors}
            </div>
          )}

          {/* Color Entries */}
          <div className="space-y-4 border border-[#d3d3d6] rounded-lg p-6">
            <div className="grid gap-4 pb-4 border-b border-[#e7e7e9] text-xs font-semibold text-[#505056]" style={{ gridTemplateColumns: '1fr 1fr 40px' }}>
              <span>Hex value</span>
              <span>Role</span>
              <span></span>
            </div>

            {colors.map((color, idx) => (
              <div
                key={idx}
                className="grid items-center gap-4"
                style={{ gridTemplateColumns: '1fr 1fr 40px' }}
              >
                {/* Color Box with Hex Value */}
                <div className="flex gap-3 items-center">
                  <div className="relative flex-shrink-0">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      disabled={saving}
                      className="w-12 h-10 p-1 rounded border border-[#d3d3d6] cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    disabled={saving}
                    placeholder="#667eea"
                    className="rounded border border-[#d3d3d6] bg-white px-3 py-2 text-sm text-[#0a0a0b] placeholder:text-[#8a8a91] outline-none focus:border-[#0a0a0b] flex-1"
                  />
                </div>

                {/* Role Dropdown */}
                <div className="relative">
                  <select
                    value={color.role}
                    onChange={(e) => handleRoleChange(idx, e.target.value)}
                    disabled={saving}
                    className="w-full rounded border border-[#d3d3d6] bg-white px-3 py-2 text-sm text-[#0a0a0b] outline-none focus:border-[#0a0a0b] appearance-none cursor-pointer"
                  >
                    <option value={color.role}>{color.role}</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
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

                {/* Remove Button */}
                <div className="flex justify-center">
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      disabled={saving}
                      className="flex items-center justify-center w-6 h-6 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Color Button */}
          <button
            type="button"
            onClick={handleAddColor}
            disabled={saving || availableRoles.length === 0}
            className="flex items-center gap-2 text-sm font-semibold text-[#0a0a0b] hover:text-[#505056] disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Color
          </button>

          {/* Palette Preview */}
          <div className="space-y-3 pt-6 border-t border-[#d3d3d6]">
            <span className="text-xs font-semibold text-[#505056]">Palette Preview</span>
            <div className="flex h-16 overflow-hidden rounded-lg border border-[#d3d3d6]">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1"
                  style={{ background: color.hex }}
                  title={`${color.role}: ${color.hex}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Brand Guide Mode */}
      {mode === "upload" && (
        <div className="space-y-6">
          {fieldErrors.colors && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {fieldErrors.colors}
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center space-y-3 transition-colors cursor-pointer ${
              uploadError ? 'border-red-500 bg-red-50' : 'border-[#d3d3d6] hover:border-[#0a0a0b] hover:bg-[#f4f4f5]'
            }`}
            onClick={() => document.getElementById('brand-guide-upload')?.click()}
          >
            <input
              id="brand-guide-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 50 * 1024 * 1024) {
                    setUploadError('File size must be under 50 MB');
                    setUploadedFile(null);
                  } else if (!file.name.match(/\.(pdf|png|jpg|jpeg)$/i)) {
                    setUploadError('Only PDF, PNG, or JPG files are allowed');
                    setUploadedFile(null);
                  } else {
                    setUploadError('');
                    setUploadedFile(file);
                    // Simulate extracting colors from brand guide
                    // In production, this would call an API to extract colors
                    setColors([
                      { hex: brandPrimaryColor || "#667eea", role: "Primary" },
                      { hex: brandSecondaryColor || "#764ba2", role: "Secondary" },
                      { hex: brandAccentColor || "#f59e0b", role: "Background" },
                      { hex: "#2B2B2B", role: "Text" },
                    ]);
                  }
                }
              }}
              disabled={saving}
            />
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded border-2 border-[#d3d3d6] flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#0a0a0b]">
                {uploadedFile ? uploadedFile.name : 'Drop your brand guide or click to browse'}
              </p>
              <p className="text-sm text-[#505056]">PDF, PNG, or JPG up to 50 MB. EB reads the hex values and adds them to your palette for review.</p>
            </div>
          </div>

          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}

          {uploadedFile && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              ✓ Brand guide uploaded successfully. Colors have been extracted for your review.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
