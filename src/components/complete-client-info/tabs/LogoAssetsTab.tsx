"use client";
import { useState } from "react";
import { Field, FileUploadArea, FileItem, RoleSelect } from "../ui";
import { Check } from "lucide-react";

interface BrandAsset {
  id: string;
  name: string;
  size: string;
  role: string;
  file?: File;
}

interface LogoAssetsTabProps {
  assets: BrandAsset[];
  setAssets: (v: BrandAsset[]) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

const ASSET_ROLES = ["Primary logo", "Icon / mark", "Wordmark", "Favicon", "Other"] as const;

const getFileIcon = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toUpperCase() || "FILE";
  return ext.length > 3 ? "FILE" : ext;
};

export function LogoAssetsTab({
  assets,
  setAssets,
  saving,
  fieldErrors = {},
}: LogoAssetsTabProps) {
  const [primaryAdded, setPrimaryAdded] = useState(
    assets.some((a) => a.role === "Primary logo")
  );

  const handleFilesSelected = (files: File[]) => {
    const newAssets: BrandAsset[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      role: "Primary logo",
      file,
    }));

    const updated = [...assets, ...newAssets];
    setAssets(updated);

    if (updated.some((a) => a.role === "Primary logo")) {
      setPrimaryAdded(true);
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    const updated = assets.map((asset) =>
      asset.id === id ? { ...asset, role: newRole } : asset
    );
    setAssets(updated);
    setPrimaryAdded(updated.some((a) => a.role === "Primary logo"));
  };

  const handleDeleteAsset = (id: string) => {
    const updated = assets.filter((asset) => asset.id !== id);
    setAssets(updated);
    setPrimaryAdded(updated.some((a) => a.role === "Primary logo"));
  };

  return (
    <div className="space-y-8 w-full">
      {/* Upload Area */}
      <div>
        <div className={fieldErrors.assets ? 'border-2 border-red-500 rounded-lg p-4' : ''}>
          <FileUploadArea onFilesSelected={handleFilesSelected} disabled={saving} />
          {fieldErrors.assets && (
            <p className="text-sm text-red-600 mt-2">{fieldErrors.assets}</p>
          )}
        </div>
      </div>

      {/* Uploaded Assets */}
      {assets.length > 0 && (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="border border-[#d3d3d6] rounded-lg p-4 flex items-center gap-4"
            >
              <div className="flex-none w-12 h-12 flex items-center justify-center bg-[#f4f4f5] rounded font-bold text-xs text-[#505056]">
                {getFileIcon(asset.name)}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[#0a0a0b]">{asset.name}</p>
                <p className="text-xs text-[#505056]">{asset.size}</p>
              </div>

              <div className="flex-none w-40">
                <RoleSelect
                  value={asset.role}
                  onChange={(role) => handleRoleChange(asset.id, role)}
                  options={ASSET_ROLES}
                  disabled={saving}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteAsset(asset.id)}
                disabled={saving}
                className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {primaryAdded && (
        <div className="flex items-center gap-2 text-sm font-medium text-[#0a0a0b]">
          <Check className="w-4 h-4" strokeWidth={3} />
          Primary logo added
        </div>
      )}
    </div>
  );
}
