"use client";
import { Field, TextInput } from "../ui";
import { Trash2, Plus } from "lucide-react";

interface Contact {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  bestWayToReach: "Email" | "Phone" | "Text" | "Slack";
  bestTime: string;
  responsibilities: string[];
}

interface ContactsTabProps {
  fullName: string;
  setFullName: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  bestWayToReach: string;
  setBestWayToReach: (v: string) => void;
  bestTime?: string;
  setBestTime?: (v: string) => void;
  responsibilities?: string[];
  setResponsibilities?: (v: string[]) => void;
  contacts?: Contact[];
  setContacts?: (v: Contact[]) => void;
  saving: boolean;
  fieldErrors?: Record<string, string>;
}

const CONTACT_OPTIONS = ["Email", "Phone", "Text", "Slack"] as const;
const TIME_OPTIONS = ["Anytime", "Morning (8-12)", "Afternoon (12-5)", "Evening (5-9)"];
const RESPONSIBILITY_OPTIONS = [
  "Deliverables for review",
  "Approves",
  "Invoices & billing",
  "Shoot scheduling",
  "Raw footage requests",
  "Analytics reports",
] as const;

export function ContactsTab({
  fullName,
  setFullName,
  role,
  setRole,
  companyName,
  setCompanyName,
  email,
  setEmail,
  phone,
  setPhone,
  bestWayToReach,
  setBestWayToReach,
  bestTime = "Anytime",
  setBestTime,
  responsibilities = [],
  setResponsibilities,
  contacts = [],
  setContacts,
  saving,
  fieldErrors = {},
}: ContactsTabProps) {
  const handleToggleResponsibility = (resp: string) => {
    if (!setResponsibilities) return;
    if (responsibilities.includes(resp)) {
      setResponsibilities(responsibilities.filter((r) => r !== resp));
    } else {
      setResponsibilities([...responsibilities, resp]);
    }
  };

  const handleAddContact = () => {
    if (!setContacts) return;
    const newContact: Contact = {
      fullName: "",
      role: "",
      email: "",
      phone: "",
      bestWayToReach: "Email",
      bestTime: "Anytime",
      responsibilities: [],
    };
    setContacts([...contacts, newContact]);
  };

  const handleRemoveContact = (index: number) => {
    if (!setContacts) return;
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleUpdateContact = (index: number, field: keyof Contact, value: any) => {
    if (!setContacts) return;
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Primary Contact */}
      <div className="border border-[#d3d3d6] rounded-lg p-6 space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#0a0a0b]">Primary Contact</h3>
            <p className="text-xs text-[#505056]">Main point of contact</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Company name">
            <TextInput
              type="text"
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={saving}
            />
          </Field>

          <Field label="Full name *" error={fieldErrors.fullName} labelClassName={fullName.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
            <TextInput
              type="text"
              placeholder="First and last name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={saving}
              error={!!fieldErrors.fullName}
            />
          </Field>

          <Field label="Role / title">
            <TextInput
              type="text"
              placeholder="Client"
              value={role || "Client"}
              onChange={(e) => setRole(e.target.value)}
              disabled={true}
            />
          </Field>

          <Field label="Email *" error={fieldErrors.email} labelClassName={email.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
            <TextInput
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              error={!!fieldErrors.email}
            />
          </Field>

          <Field label="Phone *" error={fieldErrors.phone} labelClassName={phone.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}>
            <TextInput
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saving}
              error={!!fieldErrors.phone}
            />
          </Field>
        </div>

        <div className="space-y-3">
          <label className={`text-sm font-medium ${bestWayToReach.trim() ? 'text-[#0a0a0b]' : 'text-red-600'}`}>Best way to reach you *</label>
          <div className="flex flex-wrap gap-2">
            {CONTACT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBestWayToReach(option)}
                disabled={saving}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  bestWayToReach === option
                    ? "bg-[#0a0a0b] text-white"
                    : "bg-white border border-[#d3d3d6] text-[#0a0a0b] hover:bg-[#f4f4f5]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {fieldErrors.bestWayToReach && (
            <p className="text-sm text-red-600">{fieldErrors.bestWayToReach}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Best time">
            <select
              value={bestTime}
              onChange={(e) => setBestTime?.(e.target.value)}
              disabled={saving}
              className="w-full rounded-lg border border-[#d3d3d6] bg-white px-3 py-2.5 text-base text-[#0a0a0b] outline-none focus:border-[#0a0a0b] appearance-none"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="space-y-3">
          <label className={`text-sm font-medium ${responsibilities.length > 0 ? 'text-[#0a0a0b]' : 'text-red-600'}`}>Send this person *</label>
          <div className="flex flex-wrap gap-2">
            {RESPONSIBILITY_OPTIONS.map((resp) => (
              <button
                key={resp}
                type="button"
                onClick={() => handleToggleResponsibility(resp)}
                disabled={saving}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  responsibilities.includes(resp)
                    ? "bg-[#0a0a0b] text-white"
                    : "bg-white border border-[#d3d3d6] text-[#0a0a0b] hover:bg-[#f4f4f5]"
                }`}
              >
                {resp}
              </button>
            ))}
          </div>
          {fieldErrors.responsibilities && (
            <p className="text-sm text-red-600">{fieldErrors.responsibilities}</p>
          )}
        </div>
      </div>

      {/* Additional Contacts */}
      {contacts.length > 0 && (
        <div className="space-y-4 w-full">
          {contacts.map((contact, idx) => (
            <div key={idx} className="border border-[#d3d3d6] rounded-lg p-6 space-y-4 w-full">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0a0a0b]">Contact {idx + 2}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveContact(idx)}
                  disabled={saving}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name">
                  <TextInput
                    type="text"
                    placeholder="First and last name"
                    value={contact.fullName}
                    onChange={(e) => handleUpdateContact(idx, "fullName", e.target.value)}
                    disabled={saving}
                  />
                </Field>

                <Field label="Role / title">
                  <TextInput
                    type="text"
                    placeholder="e.g. Owner, Marketing manager"
                    value={contact.role}
                    onChange={(e) => handleUpdateContact(idx, "role", e.target.value)}
                    disabled={saving}
                  />
                </Field>

                <Field label="Email">
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    value={contact.email}
                    onChange={(e) => handleUpdateContact(idx, "email", e.target.value)}
                    disabled={saving}
                  />
                </Field>

                <Field label="Phone">
                  <TextInput
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={contact.phone}
                    onChange={(e) => handleUpdateContact(idx, "phone", e.target.value)}
                    disabled={saving}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-[#0a0a0b]">Best way to reach</label>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleUpdateContact(idx, "bestWayToReach", option)}
                      disabled={saving}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        contact.bestWayToReach === option
                          ? "bg-[#0a0a0b] text-white"
                          : "bg-white border border-[#d3d3d6] text-[#0a0a0b] hover:bg-[#f4f4f5]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-[#0a0a0b]">Send this person</label>
                <div className="flex flex-wrap gap-2">
                  {RESPONSIBILITY_OPTIONS.map((resp) => (
                    <button
                      key={resp}
                      type="button"
                      onClick={() => {
                        const updated = [...contact.responsibilities];
                        if (updated.includes(resp)) {
                          updated.splice(updated.indexOf(resp), 1);
                        } else {
                          updated.push(resp);
                        }
                        handleUpdateContact(idx, "responsibilities", updated);
                      }}
                      disabled={saving}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        contact.responsibilities.includes(resp)
                          ? "bg-[#0a0a0b] text-white"
                          : "bg-white border border-[#d3d3d6] text-[#0a0a0b] hover:bg-[#f4f4f5]"
                      }`}
                    >
                      {resp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Another Contact Button */}
      <button
        type="button"
        onClick={handleAddContact}
        disabled={saving}
        className="flex items-center gap-2 text-sm font-semibold text-[#0a0a0b] hover:text-[#505056] disabled:opacity-50 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Another Contact
      </button>
    </div>
  );
}
