"use client";
import { useState } from "react";
import { Field, TextInput, PrimaryButton } from "../ui";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";

interface SocialAccount {
  platform: string;
  url: string;
  username?: string;
  password?: string;
  email?: string;
  backupCodes?: string;
  recoveryEmail?: string;
  phone?: string;
  notes?: string;
  instructions?: string;
}

interface SocialMediaTabProps {
  clientName?: string;
  socialAccounts: SocialAccount[];
  setSocialAccounts: (v: SocialAccount[]) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

const SOCIAL_PLATFORMS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "LinkedIn",
  "Twitter/X",
  "Snapchat",
  "Pinterest",
] as const;

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  YouTube: "In YouTube Studio, go to Settings, then Permissions, then Invite, and give EB the Manager role. The video below walks through each step. Then enter the channel login below. EB keeps it on file as a backup if the invite is removed or access breaks.",
  Facebook: "Facebook and Instagram are both managed in Meta Business Suite, so one invite covers both. In Meta Business Suite, go to Settings, then People, then Add People, and give EB Full control of your Facebook Page and Instagram account. Then enter the account login below. EB keeps it on file as a backup if the invite is removed or access breaks.",
  Instagram: "Facebook and Instagram are both managed in Meta Business Suite, so one invite covers both. In Meta Business Suite, go to Settings, then People, then Add People, and give EB Full control of your Facebook Page and Instagram account. Then enter the account login below. EB keeps it on file as a backup if the invite is removed or access breaks.",
  TikTok: "In TikTok, go to Settings, then Permissions, then Invite, and give EB the Manager role. The video below walks through each step. Then enter the channel login below. EB keeps it on file as a backup if the invite is removed or access breaks.",
};

export function SocialMediaTab({
  clientName,
  socialAccounts,
  setSocialAccounts,
  saving,
  fieldErrors = {},
}: SocialMediaTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SocialAccount>({
    platform: "Instagram",
    url: "",
    username: "",
    password: "",
    email: "",
    backupCodes: "",
    recoveryEmail: "",
    phone: "",
    notes: "",
  });

  const usedPlatforms = socialAccounts.map((acc) => acc.platform);
  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => !usedPlatforms.includes(p) || (modalMode === "edit" && socialAccounts[editingIndex || 0]?.platform === p)
  );

  const handleOpenModal = (mode: "add" | "edit" = "add", index?: number) => {
    setModalMode(mode);
    if (mode === "edit" && index !== undefined) {
      setEditingIndex(index);
      setFormData(socialAccounts[index]);
    } else {
      setEditingIndex(null);
      setFormData({
        platform: availablePlatforms[0] || "Instagram",
        url: "",
        username: "",
        password: "",
        email: "",
        backupCodes: "",
        recoveryEmail: "",
        phone: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowPassword(false);
    setModalErrors({});
  };

  const handleSaveCredentials = () => {
    const errors: Record<string, string> = {};

    if (!formData.platform?.trim()) errors.platform = 'Platform is required';
    if (!formData.username?.trim()) errors.username = 'Username / Handle is required';
    if (!formData.password?.trim()) errors.password = 'Password is required';
    if (formData.url && !formData.url.startsWith('http')) errors.url = 'URL must start with http:// or https://';

    if (Object.keys(errors).length > 0) {
      setModalErrors(errors);
      return;
    }

    const updated = [...socialAccounts];
    if (modalMode === "edit" && editingIndex !== null) {
      updated[editingIndex] = formData;
    } else {
      updated.push(formData);
    }
    setSocialAccounts(updated);
    handleCloseModal();
  };

  const handleDeleteAccount = (index: number) => {
    setSocialAccounts(socialAccounts.filter((_, i) => i !== index));
  };

  const platformIcon = (platform: string): string => {
    const icons: Record<string, string> = {
      Instagram: "IG",
      TikTok: "TT",
      YouTube: "YT",
      Facebook: "FB",
      LinkedIn: "IN",
      "Twitter/X": "X",
      Snapchat: "SC",
      Pinterest: "PI",
    };
    return icons[platform] || platform.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#0a0a0b]">Social Media Accounts</h3>
          <p className={`text-xs ${fieldErrors.social ? 'text-red-600' : 'text-[#505056]'}`}>
            {socialAccounts.length > 0 && `${socialAccounts.length} Account${socialAccounts.length !== 1 ? "s" : ""}`}
            {fieldErrors.social && ` — ${fieldErrors.social}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal("add")}
          disabled={saving || availablePlatforms.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0b] text-white rounded font-semibold hover:opacity-85 disabled:opacity-50 cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Login
        </button>
      </div>

      {/* Existing Accounts */}
      <div className="space-y-4">
        {socialAccounts.length === 0 ? (
          <div className="rounded-lg bg-[#f4f4f5] p-6 text-center">
            <p className="text-sm text-[#505056]">
              Add login credentials for your social media accounts. These will be saved securely.
            </p>
          </div>
        ) : (
          socialAccounts.map((account, idx) => (
            <div
              key={idx}
              className="border border-[#d3d3d6] rounded-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded bg-[#0a0a0b] text-white font-bold text-sm">
                    {platformIcon(account.platform)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0a0a0b]">{account.platform}</h4>
                    {account.email && (
                      <p className="text-xs text-[#505056]">{account.email}</p>
                    )}
                    {account.username && (
                      <p className="text-xs text-[#505056]">@{account.username}</p>
                    )}
                    {account.url && (
                      <p className="text-xs text-blue-600 truncate">{account.url}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenModal("edit", idx)}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm font-medium border border-[#d3d3d6] rounded hover:bg-[#f4f4f5] cursor-pointer disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAccount(idx)}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded hover:bg-red-50 cursor-pointer disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {account.password && (
                <div className="pt-2 border-t border-[#d3d3d6]">
                  <p className="text-xs text-[#505056]">Full control access</p>
                  <p className="text-xs text-[#505056]">granted via email invite</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0a0a0b]">Add Login Credentials</h2>
              <p className="text-sm text-[#505056]">Add social media login credentials for your account</p>
            </div>

            {/* Client & Platform */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Client">
                <input
                  type="text"
                  value={clientName || "Client Name"}
                  disabled
                  className="w-full rounded-lg border border-[#d3d3d6] bg-[#f4f4f5] px-3 py-2.5 text-base text-[#0a0a0b] outline-none cursor-not-allowed"
                />
              </Field>

              <Field label="Platform *">
                <div className="relative">
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] outline-none focus:border-[#0a0a0b] appearance-none cursor-pointer"
                  >
                    {availablePlatforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
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
              </Field>
            </div>

            {/* Instructions */}
            {PLATFORM_INSTRUCTIONS[formData.platform] && (
              <div className="bg-[#f4f4f5] rounded-lg p-4 space-y-3">
                <p className="text-sm text-[#0a0a0b]">
                  <strong>Two parts: Invite EB, then share the login</strong>
                </p>
                <p className="text-sm text-[#505056]">{PLATFORM_INSTRUCTIONS[formData.platform]}</p>
                <a href="#" className="text-sm text-blue-600 font-medium">
                  Open video on YouTube
                </a>
              </div>
            )}

            {/* Login Credentials */}
            <Field label="Username / Handle *" error={modalErrors.username}>
              <TextInput
                type="text"
                placeholder="@username or email"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                error={!!modalErrors.username}
              />
            </Field>

            <Field label="Password *" error={modalErrors.password}>
              <div className="flex gap-2">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={!!modalErrors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 py-2.5 border border-[#d3d3d6] rounded-lg hover:bg-[#f4f4f5] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <Field label="Login page URL" error={modalErrors.url}>
              <TextInput
                type="url"
                placeholder="https://tiktok.com/login"
                value={formData.url || ""}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                error={!!modalErrors.url}
              />
              <p className="text-xs text-[#505056] mt-1">Direct link to the login or account management page</p>
            </Field>

            <Field label="Backup codes location">
              <TextInput
                type="text"
                placeholder="e.g. Google Drive link, Vault note"
                value={formData.backupCodes || ""}
                onChange={(e) => setFormData({ ...formData, backupCodes: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Recovery email">
                <TextInput
                  type="email"
                  placeholder="recovery@email.com"
                  value={formData.recoveryEmail || ""}
                  onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                />
              </Field>

              <Field label="Phone">
                <TextInput
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                placeholder="2FA enabled, backup codes in drive, etc"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] placeholder:text-[#8a8a91] outline-none focus:border-[#0a0a0b] resize-none"
                rows={3}
              />
            </Field>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end border-t border-[#d3d3d6] pt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-[#d3d3d6] rounded-lg font-semibold hover:bg-[#f4f4f5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCredentials}
                className="px-4 py-2 bg-[#0a0a0b] text-white rounded-lg font-semibold hover:opacity-85 cursor-pointer"
              >
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
