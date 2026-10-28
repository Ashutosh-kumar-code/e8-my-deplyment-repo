'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';
import { AlertCircle, Check } from 'lucide-react';
import { PrimaryButton, ProgressBar } from '@/components/complete-client-info/ui';
import { ContactsTab } from '@/components/complete-client-info/tabs/ContactsTab';
import { SocialMediaTab } from '@/components/complete-client-info/tabs/SocialMediaTab';
import { BrandColorsTab } from '@/components/complete-client-info/tabs/BrandColorsTab';
import { BrandVoiceTab } from '@/components/complete-client-info/tabs/BrandVoiceTab';
import { LogoAssetsTab } from '@/components/complete-client-info/tabs/LogoAssetsTab';
import { FontsTab } from '@/components/complete-client-info/tabs/FontsTab';
import { CompetitorsReferencesTab } from '@/components/complete-client-info/tabs/CompetitorsReferencesTab';
import { RawFootageTab } from '@/components/complete-client-info/tabs/RawFootageTab';
import { ReviewSubmitTab } from '@/components/complete-client-info/tabs/ReviewSubmitTab';

type Tab = 'contacts' | 'social' | 'colors' | 'assets' | 'fonts' | 'voice' | 'competitors' | 'footage' | 'review';

const TAB_LABELS: Record<Tab, string> = {
  contacts: 'Contacts',
  social: 'Social Media Accounts',
  colors: 'Brand Colors',
  assets: 'Logo & Brand Assets',
  fonts: 'Fonts',
  voice: 'Brand Voice',
  competitors: 'Competitors & References',
  footage: 'Raw Footage',
  review: 'Review & Submit',
};

const TAB_REQUIRED: Record<Tab, boolean> = {
  contacts: true,
  social: true,
  colors: true,
  assets: true,
  fonts: true,
  voice: false,
  competitors: false,
  footage: false,
  review: true,
};

const TABS: Tab[] = ['contacts', 'social', 'colors', 'assets', 'fonts', 'voice', 'competitors', 'footage', 'review'];

export default function CompleteClientInfoPage() {
  const router = useRouter();
  const { refreshUser, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Contact Info
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bestWayToReach, setBestWayToReach] = useState('');
  const [bestTime, setBestTime] = useState('Anytime');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [additionalContacts, setAdditionalContacts] = useState<any[]>([]);

  // Social Media
  const [socialAccounts, setSocialAccounts] = useState<Array<{ platform: string; url: string }>>([]);

  // Brand Colors
  const [brandPrimaryColor, setBrandPrimaryColor] = useState('#667eea');
  const [brandSecondaryColor, setBrandSecondaryColor] = useState('#764ba2');
  const [brandAccentColor, setBrandAccentColor] = useState('#f59e0b');

  // Assets & Logo
  const [brandAssets, setBrandAssets] = useState<Array<{ id: string; name: string; size: string; role: string; file?: File }>>([]);

  // Fonts
  const [primaryFont, setPrimaryFont] = useState<{ name: string; link: string; weight: string } | null>(null);
  const [bodyFont, setBodyFont] = useState<{ name: string; link: string; weight: string } | null>(null);
  const [customFonts, setCustomFonts] = useState<File[]>([]);
  const [noBrandFonts, setNoBrandFonts] = useState(false);

  // Brand Voice
  const [brandVoice, setBrandVoice] = useState('');
  const [brandValues, setBrandValues] = useState('');
  const [tones, setTones] = useState<string[]>([]);
  const [dos, setDos] = useState('');
  const [donts, setDonts] = useState('');
  const [avoidWords, setAvoidWords] = useState('');
  const [defaultHashtags, setDefaultHashtags] = useState('');

  // Competitors & References
  const [competitors, setCompetitors] = useState<Array<{ id: string; businessName: string; profile: string }>>([]);
  const [references, setReferences] = useState<Array<{ id: string; link: string; notes: string }>>([]);

  // Raw Footage
  const [rawFootageFiles, setRawFootageFiles] = useState<any[]>([]);
  const [rawFootageNotes, setRawFootageNotes] = useState('');

  // Theme Preference
  const [themePreference, setThemePreference] = useState('light');

  // Field Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  // Help Videos Modal
  const [showHelpVideos, setShowHelpVideos] = useState(false);

  // Check if already completed on mount
  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const response = await fetch('/api/auth/check-client-info');
        const data = await response.json();

        if (response.ok && data.infoCompleted) {
          // Already completed, redirect to dashboard
          router.push('/dashboard');
          return;
        }

        // Not completed, fetch current data to pre-fill form
        const clientRes = await fetch('/api/auth/get-client-info');
        if (clientRes.ok) {
          const clientData = await clientRes.json();
          if (clientData.ok && clientData.client) {
            // Prefill from client data
            setFullName(clientData.client.fullName || user?.name || '');
            setRole(clientData.client.name || '');
            setCompanyName(clientData.client.companyName || '');
            setEmail(clientData.client.email || user?.email || '');
            setPhone(clientData.client.phone || '');
            setBestWayToReach(clientData.client.bestWayToReach || '');
            setBestTime(clientData.client.bestTime || 'Anytime');
            setResponsibilities(clientData.client.responsibilities || []);
            setAdditionalContacts(clientData.client.additionalContacts || []);
            setSocialAccounts(clientData.client.socialAccounts || []);
            setBrandPrimaryColor(clientData.client.brandPrimaryColor || '#667eea');
            setBrandSecondaryColor(clientData.client.brandSecondaryColor || '#764ba2');
            setBrandAccentColor(clientData.client.brandAccentColor || '#f59e0b');
            setBrandAssets(clientData.client.brandAssets || []);
            if (clientData.client.primaryFont) {
              setPrimaryFont(typeof clientData.client.primaryFont === 'string' ? JSON.parse(clientData.client.primaryFont) : clientData.client.primaryFont);
            }
            if (clientData.client.secondaryFont) {
              setBodyFont(typeof clientData.client.secondaryFont === 'string' ? JSON.parse(clientData.client.secondaryFont) : clientData.client.secondaryFont);
            }
            setCustomFonts(clientData.client.customFonts || []);
            setNoBrandFonts(clientData.client.noBrandFonts || false);
            setBrandVoice(clientData.client.brandVoice || '');
            setBrandValues((clientData.client.brandValues || []).join(', '));
            setTones(clientData.client.tones || []);
            setDos(clientData.client.dos || '');
            setDonts(clientData.client.donts || '');
            setAvoidWords(clientData.client.avoidWords || '');
            setDefaultHashtags(clientData.client.defaultHashtags || '');
            setCompetitors(clientData.client.competitors || []);
            setReferences(clientData.client.references || []);
            setRawFootageFiles(clientData.client.rawFootageLinks || []);
            setThemePreference(clientData.client.themePreference || 'light');
          } else if (user) {
            // No client data but user exists - pre-fill with user session data
            setFullName(user.name || '');
            setEmail(user.email || '');
          }
        } else if (user) {
          // API error - pre-fill with user session data as fallback
          setFullName(user.name || '');
          setEmail(user.email || '');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error checking client info:', err);
        setLoading(false);
      }
    };

    checkCompletion();
  }, [router, user]);

  const validateTab = (tab: Tab): boolean => {
    const errors: Record<string, string> = {};

    if (tab === 'contacts') {
      if (!fullName.trim()) errors.fullName = 'Full name is required';
      if (!email.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email address';
      if (!phone.trim()) errors.phone = 'Phone number is required';
      if (!bestWayToReach) errors.bestWayToReach = 'Please select how to reach you';
      if (responsibilities.length === 0) errors.responsibilities = 'Please select at least one responsibility';
    }

    if (tab === 'social') {
      if (socialAccounts.length === 0) errors.social = 'At least one social media account is required';
      else {
        socialAccounts.forEach((acc, idx) => {
          if (!acc.url.trim()) errors[`social_${idx}`] = 'URL is required';
          else if (!acc.url.startsWith('http')) errors[`social_${idx}`] = 'URL must start with http:// or https://';
        });
      }
    }

    if (tab === 'colors') {
      if (!brandPrimaryColor?.trim()) {
        errors.colors = 'Please select your brand primary color';
      }
    }

    if (tab === 'assets') {
      if (brandAssets.length === 0) errors.assets = 'At least one brand asset or logo is required';
    }

    if (tab === 'fonts') {
      if (!noBrandFonts && customFonts.length === 0) {
        const primaryFontComplete = primaryFont?.name?.trim() && primaryFont?.link?.trim();
        const bodyFontComplete = bodyFont?.name?.trim() && bodyFont?.link?.trim();
        if (!primaryFontComplete || !bodyFontComplete) {
          errors.fonts = 'Both heading and body fonts must be filled with name and link';
        }
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setShowFieldErrors(true);
    } else {
      setShowFieldErrors(false);
    }
    return Object.keys(errors).length === 0;
  };

  const handleNextTab = () => {
    if (validateTab(activeTab)) {
      const nextIndex = TABS.indexOf(activeTab) + 1;
      if (nextIndex < TABS.length) {
        setActiveTab(TABS[nextIndex]);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    
    // Contact validations
    if (!fullName.trim()) errors.push('Full name is required');
    if (!email.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Valid email is required');
    if (!phone.trim()) errors.push('Phone number is required');
    if (!bestWayToReach.trim()) errors.push('Best way to reach you is required');
    if (responsibilities.length === 0) errors.push('At least one responsibility is required');
    
    // Social validations
    if (socialAccounts.length === 0) errors.push('At least one social media account is required');
    else {
      socialAccounts.forEach((acc, idx) => {
        if (!acc.url?.trim()) errors.push(`Social account ${idx + 1}: URL is required`);
        else if (!acc.url.startsWith('http')) errors.push(`Social account ${idx + 1}: URL must start with http:// or https://`);
      });
    }
    
    // Brand colors validation
    if (!brandPrimaryColor?.trim()) errors.push('Brand colors are required');
    
    // Assets validation
    if (brandAssets.length === 0) errors.push('At least one brand asset or logo is required');
    
    // Fonts validation
    if (!noBrandFonts && customFonts.length === 0) {
      const primaryFontComplete = primaryFont?.name?.trim() && primaryFont?.link?.trim();
      const bodyFontComplete = bodyFont?.name?.trim() && bodyFont?.link?.trim();
      if (!primaryFontComplete || !bodyFontComplete) {
        errors.push('Both heading and body fonts must be filled with name and link');
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setSaving(true);

    try {
      const brandValuesArray = brandValues
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      const response = await fetch('/api/auth/complete-client-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          bestWayToReach,
          bestTime,
          responsibilities,
          additionalContacts,
          socialAccounts,
          brandPrimaryColor,
          brandSecondaryColor,
          brandAccentColor,
          brandAssets,
          primaryFont,
          bodyFont,
          customFonts: [],
          noBrandFonts,
          brandVoice: brandVoice.trim(),
          brandValues: brandValuesArray,
          tones,
          dos,
          donts,
          avoidWords,
          defaultHashtags,
          competitors,
          references,
          rawFootageFiles,
          themePreference,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Client information saved successfully!');
        await refreshUser();
        setTimeout(() => {
          router.push('/dashboard/welcome');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to save client information');
      }
    } catch (err) {
      console.error('Error saving client info:', err);
      toast.error('Failed to save client information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <div className="w-10 h-10 rounded-full border-2 border-[#d3d3d6] border-t-[#0a0a0b] animate-spin" />
          </div>
          <p className="text-[#505056]">Loading...</p>
        </div>
      </div>
    );
  }

  const tabIndex = TABS.indexOf(activeTab);
  
  const getTabCompletion = (tab: Tab): boolean => {
    if (tab === 'contacts') return fullName.trim().length > 0 && email.trim().length > 0 && bestWayToReach.trim().length > 0;
    if (tab === 'social') return socialAccounts.length > 0;
    if (tab === 'colors') return !!(brandPrimaryColor?.trim());
    if (tab === 'assets') return brandAssets.length > 0;
    if (tab === 'fonts') {
      if (noBrandFonts) return true;
      const primaryFontComplete = primaryFont?.name?.trim() && primaryFont?.link?.trim();
      const bodyFontComplete = bodyFont?.name?.trim() && bodyFont?.link?.trim();
      return !!(primaryFontComplete && bodyFontComplete) || customFonts.length > 0;
    }
    if (tab === 'voice') return brandVoice.trim().length > 0 || tones.length > 0;
    if (tab === 'competitors') return competitors.length > 0 || references.length > 0;
    if (tab === 'footage') return rawFootageFiles.length > 0;
    if (tab === 'review') return false;
    return false;
  };

  const completedCount = TABS.filter(getTabCompletion).length;
  
  const incompleteRequiredTabs = TABS.filter(tab => TAB_REQUIRED[tab] && !getTabCompletion(tab));

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#0a0a0b]">
      {/* Top Header */}
      <div className="border-b border-[#d3d3d6] px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <img src="/assets/e8-logo-black.png" alt="E8 Productions" className="h-8 w-auto" />
          <span className="text-lg font-semibold">Client Onboarding</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHelpVideos(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#d3d3d6] rounded-lg text-sm font-medium hover:bg-[#f4f4f5] cursor-pointer"
          >
            <span>📺</span>
            Help Videos
          </button>
          <span className="text-sm font-medium">{user?.name || 'Client'}</span>
          <span className="text-xs text-[#505056]">HC</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
      {/* Left Sidebar */}
      <div className="w-72 flex-none border-r border-[#d3d3d6] bg-[#f4f4f5] px-6 py-8 flex flex-col">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.02em] text-[#505056]">
              Setup Progress
            </span>
            <ProgressBar pct={(completedCount / TABS.length) * 100} />
            <span className="text-xs text-[#505056]">
              {completedCount} of {TABS.length} sections complete
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {TABS.map((tab, idx) => {
            const isActive = tab === activeTab;
            const isRequired = TAB_REQUIRED[tab];
            const isComplete = getTabCompletion(tab);
            const showRedForIncomplete = isRequired && !isComplete;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                  isActive ? 'bg-white' : 'hover:bg-[#e7e7e9]'
                }`}
              >
                {isComplete ? (
                  <span className="flex size-6 flex-none items-center justify-center rounded-full bg-[#0a0a0b]">
                    <Check className="size-3.5 text-white" strokeWidth={2.5} />
                  </span>
                ) : (
                  <span
                    className={`flex size-6 flex-none items-center justify-center rounded-full text-xs font-semibold ${
                      isActive
                        ? showRedForIncomplete
                          ? 'border-2 border-red-600 bg-red-50 text-red-600'
                          : 'border-2 border-[#0a0a0b] bg-white'
                        : showRedForIncomplete
                        ? 'border-2 border-red-600 bg-red-50 text-red-600'
                        : 'border border-[#d3d3d6] bg-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
                <div className="flex-1">
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'} ${
                    showRedForIncomplete ? 'text-red-600' : ''
                  }`}>
                    {TAB_LABELS[tab]}
                  </span>
                  <span className={`text-xs ml-1 ${
                    showRedForIncomplete ? 'text-red-600' : 'text-[#8a8a91]'
                  }`}>
                    {isRequired ? '(Required)' : '(Optional)'}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 overflow-auto px-12 py-12">
          <div className="w-full">
            {/* Tab Header */}
            <div className="mb-8 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.02em] text-[#505056]">
                Step {tabIndex + 1} of {TABS.length}
              </span>
              <h1 className="text-2xl font-bold leading-tight">
                {TAB_LABELS[activeTab]}
              </h1>
              <p className="text-sm text-[#505056]">
                {TAB_REQUIRED[activeTab] ? '* Required' : '* Optional'}
              </p>
            </div>

            {/* Tab Content */}
            <form onSubmit={handleSave} className="flex flex-col gap-8">
              {activeTab === 'contacts' && (
                <ContactsTab
                  fullName={fullName}
                  setFullName={setFullName}
                  role={role}
                  setRole={setRole}
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  bestWayToReach={bestWayToReach}
                  setBestWayToReach={setBestWayToReach}
                  bestTime={bestTime}
                  setBestTime={setBestTime}
                  responsibilities={responsibilities}
                  setResponsibilities={setResponsibilities}
                  contacts={additionalContacts}
                  setContacts={setAdditionalContacts}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'social' && (
                <SocialMediaTab
                  clientName={fullName}
                  socialAccounts={socialAccounts}
                  setSocialAccounts={setSocialAccounts}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'colors' && (
                <BrandColorsTab
                  brandPrimaryColor={brandPrimaryColor}
                  setBrandPrimaryColor={setBrandPrimaryColor}
                  brandSecondaryColor={brandSecondaryColor}
                  setBrandSecondaryColor={setBrandSecondaryColor}
                  brandAccentColor={brandAccentColor}
                  setBrandAccentColor={setBrandAccentColor}
                  themePreference={themePreference}
                  setThemePreference={setThemePreference}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'assets' && (
                <LogoAssetsTab
                  assets={brandAssets}
                  setAssets={setBrandAssets}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'fonts' && (
                <FontsTab
                  primaryFont={primaryFont}
                  setPrimaryFont={setPrimaryFont}
                  bodyFont={bodyFont}
                  setBodyFont={setBodyFont}
                  customFonts={customFonts}
                  setCustomFonts={setCustomFonts}
                  noBrandFonts={noBrandFonts}
                  setNoBrandFonts={setNoBrandFonts}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'voice' && (
                <BrandVoiceTab
                  brandVoice={brandVoice}
                  setBrandVoice={setBrandVoice}
                  brandValues={brandValues}
                  setBrandValues={setBrandValues}
                  tones={tones}
                  setTones={setTones}
                  dos={dos}
                  setDos={setDos}
                  donts={donts}
                  setDonts={setDonts}
                  avoidWords={avoidWords}
                  setAvoidWords={setAvoidWords}
                  defaultHashtags={defaultHashtags}
                  setDefaultHashtags={setDefaultHashtags}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'competitors' && (
                <CompetitorsReferencesTab
                  competitors={competitors}
                  setCompetitors={setCompetitors}
                  references={references}
                  setReferences={setReferences}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'footage' && (
                <RawFootageTab
                  files={rawFootageFiles}
                  setFiles={setRawFootageFiles}
                  notes={rawFootageNotes}
                  setNotes={setRawFootageNotes}
                  saving={saving}
                  fieldErrors={fieldErrors}
                />
              )}
              {activeTab === 'review' && (
                <>
                  {incompleteRequiredTabs.length > 0 && (
                    <div className="mb-8 rounded-lg border border-red-300 bg-red-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-red-600 mt-0.5 flex-none" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-700 mb-2">Complete these required sections:</h3>
                          <ul className="space-y-1">
                            {incompleteRequiredTabs.map((tab, idx) => (
                              <li key={idx} className="text-sm text-red-700">
                                • {TAB_LABELS[tab]}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <ReviewSubmitTab
                    items={[
                      {
                        title: 'Contacts',
                        content: `${fullName} <${email}> (${bestWayToReach}) — ${responsibilities.join(', ')}`,
                        onEdit: () => setActiveTab('contacts'),
                        isComplete: getTabCompletion('contacts'),
                        isRequired: TAB_REQUIRED['contacts'],
                      },
                      {
                        title: 'Social Media Accounts',
                        content: socialAccounts.map(a => `${a.platform}: ${a.url}`).join(' • '),
                        onEdit: () => setActiveTab('social'),
                        isComplete: getTabCompletion('social'),
                        isRequired: TAB_REQUIRED['social'],
                      },
                      {
                        title: 'Brand Colors',
                        content: `${brandPrimaryColor}, ${brandSecondaryColor}, ${brandAccentColor}`,
                        onEdit: () => setActiveTab('colors'),
                        isComplete: getTabCompletion('colors'),
                        isRequired: TAB_REQUIRED['colors'],
                      },
                      {
                        title: 'Logos & Brand Assets',
                        content: brandAssets.map(a => `${a.name} (${a.role})`).join(', '),
                        onEdit: () => setActiveTab('assets'),
                        isComplete: getTabCompletion('assets'),
                        isRequired: TAB_REQUIRED['assets'],
                      },
                      {
                        title: 'Fonts',
                        content: `${primaryFont?.name || 'None'} • ${bodyFont?.name || 'None'}`,
                        onEdit: () => setActiveTab('fonts'),
                        isComplete: getTabCompletion('fonts'),
                        isRequired: TAB_REQUIRED['fonts'],
                      },
                      {
                        title: 'Brand Voice',
                        content: `${tones.join(', ')} • ${dos.substring(0, 30)}...`,
                        onEdit: () => setActiveTab('voice'),
                        isComplete: getTabCompletion('voice'),
                        isRequired: TAB_REQUIRED['voice'],
                      },
                      {
                        title: 'Competitors & References',
                        content: `${competitors.length} competitors • ${references.length} references`,
                        onEdit: () => setActiveTab('competitors'),
                        isComplete: getTabCompletion('competitors'),
                        isRequired: TAB_REQUIRED['competitors'],
                      },
                    ]}
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 justify-between pt-8">
                <button
                  type="button"
                  onClick={() => setActiveTab(TABS[Math.max(0, tabIndex - 1)])}
                  disabled={tabIndex === 0 || saving}
                  className="px-4 py-2 rounded-lg border border-[#0a0a0b] text-[#0a0a0b] font-semibold hover:bg-[#f4f4f5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                {tabIndex < TABS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextTab}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#0a0a0b] text-white font-semibold hover:opacity-85 disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Complete Setup'}
                  </PrimaryButton>
                )}
              </div>
            </form>

            <p className="text-xs text-[#505056] text-center mt-8">
              You must complete all required sections before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Help Videos Modal */}
      {showHelpVideos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0a0a0b]">Help Videos</h2>
                <p className="text-sm text-[#505056] mt-1">
                  How EB works and how to use the EB App: reviews, approvals, raw footage, and analytics.
                </p>
              </div>
              <button
                onClick={() => setShowHelpVideos(false)}
                className="text-2xl font-light text-[#505056] hover:text-[#0a0a0b] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* YouTube Video Player */}
            <div className="w-full bg-[#f4f4f5] rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Help Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              />
            </div>

            {/* Playlist Info */}
            <div className="space-y-3 pt-4 border-t border-[#d3d3d6]">
              <p className="text-sm text-[#505056]">
                Use the playlist menu in the player to jump between videos.
              </p>
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLdQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Open playlist on YouTube
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-[#d3d3d6]">
              <button
                onClick={() => setShowHelpVideos(false)}
                className="px-6 py-2 bg-[#0a0a0b] text-white rounded-lg font-semibold hover:opacity-85 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
