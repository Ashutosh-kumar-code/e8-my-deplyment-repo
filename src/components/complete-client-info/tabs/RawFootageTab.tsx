"use client";
import { useState } from "react";
import { Field, FileUploadArea } from "../ui";
import { X } from "lucide-react";

interface RawFootageFile {
  id: string;
  name: string;
  size: string;
  status: "uploading" | "uploaded";
  progress: number;
}

interface RawFootageTabProps {
  files: RawFootageFile[];
  setFiles: (v: RawFootageFile[]) => void;
  notes: string;
  setNotes: (v: string) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

export function RawFootageTab({
  files,
  setFiles,
  notes,
  setNotes,
  saving,
  fieldErrors = {},
}: RawFootageTabProps) {
  const [uploading, setUploading] = useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    const newItems: RawFootageFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} GB`,
      status: "uploading" as const,
      progress: Math.random() * 100,
    }));

    setFiles([...files, ...newItems]);
    setUploading(true);

    // Simulate upload progress
    setTimeout(() => {
      const updatedFiles = files.map((f: RawFootageFile) =>
        newItems.find((ni) => ni.id === f.id)
          ? { ...f, status: "uploaded" as const, progress: 100 }
          : f
      );
      setFiles(updatedFiles);
      setUploading(false);
    }, 2000);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const totalSize = files.reduce((sum, f) => {
    const sizeNum = parseFloat(f.size);
    return sum + sizeNum;
  }, 0);

  return (
    <div className="space-y-8 w-full">
      {/* Upload Area */}
      <div>
        <FileUploadArea
          onFilesSelected={handleFilesSelected}
          accept=".mp4,.mov,.mxf,.r3d,.avi,.mkv,.webm"
          disabled={saving || uploading}
        />
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 border border-[#d3d3d6] rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0a0a0b]">{file.name}</p>
                <p className="text-xs text-[#505056]">{file.size}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-medium text-[#505056]">
                    {file.status === "uploading" ? (
                      <>Uploading {file.progress.toFixed(0)}%</>
                    ) : (
                      <>Uploaded</>
                    )}
                  </div>
                </div>

                {file.status === "uploading" && (
                  <div className="w-24 h-1 bg-[#d3d3d6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0a0a0b]"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteFile(file.id)}
                  disabled={saving}
                  className="p-2 hover:bg-[#f4f4f5] rounded cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storage Info */}
      {files.length > 0 && (
        <div className="text-xs text-[#505056]">
          {totalSize.toFixed(2)} GB of 3 TB raw footage storage used
          <br />
          Optional. You can upload more anytime from Raw footage.
        </div>
      )}

      {/* Notes */}
      <Field label="Notes for our team (optional)">
        <textarea
          placeholder="Clips 01-14 are from the March grand opening."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={saving}
          className="w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] placeholder:text-[#8a8a91] outline-none focus:border-[#0a0a0b] resize-none"
          rows={4}
        />
      </Field>
    </div>
  );
}
