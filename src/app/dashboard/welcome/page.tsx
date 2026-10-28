'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface ClientInfo {
  fullName: string;
  brandAssets: Array<{ role: string }>;
  rawFootageFiles: Array<{ id: string }>;
  socialAccounts: Array<{ platform: string }>;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  brandAccentColor: string;
  primaryFont?: { name: string };
  bodyFont?: { name: string };
  tones: string[];
}

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const res = await fetch('/api/auth/get-client-info');
        if (res.ok) {
          const data = await res.json();
          setClientInfo(data.client);
        }
      } catch (err) {
        console.error('Error fetching client info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
  }, []);

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

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const editOnboarding = () => {
    router.push('/complete-client-info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="border-b border-[#d3d3d6] px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0a0a0b] rounded flex items-center justify-center text-white font-bold">E</div>
          <span className="text-lg font-semibold">Client Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={goToDashboard}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#d3d3d6] rounded-lg text-sm font-medium hover:bg-[#f4f4f5] cursor-pointer"
          >
            <span>📺</span>
            Help Videos
          </button>
          <span className="text-sm font-medium">{user?.name || 'Client'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-3xl space-y-8">
          {/* Welcome Header */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.02em] text-[#505056] mb-2">Dashboard</p>
            <h1 className="text-4xl font-bold text-[#0a0a0b]">
              Welcome to EB, {clientInfo?.fullName || user?.name || 'Client'}.
            </h1>
          </div>

          {/* Onboarding Submitted Card */}
          <div className="border border-[#d3d3d6] rounded-lg p-6 flex items-start gap-4 bg-[#f9f9f9]">
            <div className="flex-none">
              <div className="w-8 h-8 rounded-full bg-[#0a0a0b] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#0a0a0b]">Onboarding Submitted</h3>
              <p className="text-sm text-[#505056] mt-1">
                Your account manager reviews your brand kit within 1 business day. Our team starts on your first deliverables once it's approved.
              </p>
            </div>
            <button
              onClick={editOnboarding}
              className="flex-none px-4 py-2 border border-[#0a0a0b] text-[#0a0a0b] rounded-lg font-semibold hover:bg-[#f4f4f5] cursor-pointer text-sm"
            >
              Edit Onboarding
            </button>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Brand Kit Card */}
            <div className="border border-[#d3d3d6] rounded-lg p-6 space-y-4 hover:border-[#0a0a0b] transition-colors">
              <h3 className="font-semibold text-[#0a0a0b]">Brand Kit</h3>
              
              {/* Color Preview */}
              {clientInfo?.brandPrimaryColor && (
                <div className="flex h-12 gap-2 rounded-lg overflow-hidden border border-[#d3d3d6]">
                  <div
                    className="flex-1"
                    style={{ backgroundColor: clientInfo.brandPrimaryColor }}
                    title="Primary"
                  />
                  {clientInfo.brandSecondaryColor && (
                    <div
                      className="flex-1"
                      style={{ backgroundColor: clientInfo.brandSecondaryColor }}
                      title="Secondary"
                    />
                  )}
                  {clientInfo.brandAccentColor && (
                    <div
                      className="flex-1"
                      style={{ backgroundColor: clientInfo.brandAccentColor }}
                      title="Accent"
                    />
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <p className="text-[#505056]">
                  <span className="font-medium text-[#0a0a0b]">{clientInfo?.brandAssets?.length || 0} assets</span>
                  {(clientInfo?.primaryFont?.name || clientInfo?.bodyFont?.name) && (
                    <> • <span className="font-medium text-[#0a0a0b]">
                      {clientInfo?.primaryFont?.name || clientInfo?.bodyFont?.name}
                    </span></>
                  )}
                </p>
              </div>
            </div>

            {/* Raw Footage Card */}
            <div className="border border-[#d3d3d6] rounded-lg p-6 space-y-4 hover:border-[#0a0a0b] transition-colors">
              <h3 className="font-semibold text-[#0a0a0b]">Raw Footage</h3>
              <div className="text-3xl font-bold text-[#0a0a0b]">
                {clientInfo?.rawFootageFiles?.length || 0} {clientInfo?.rawFootageFiles?.length === 1 ? 'file' : 'files'}
              </div>
              <p className="text-xs text-[#505056]">
                5.30 GB of 3 TB raw footage storage used
              </p>
            </div>

            {/* Social Media Accounts Card */}
            <div className="border border-[#d3d3d6] rounded-lg p-6 space-y-4 hover:border-[#0a0a0b] transition-colors">
              <h3 className="font-semibold text-[#0a0a0b]">Social Media Accounts</h3>
              <div className="space-y-2">
                {clientInfo?.socialAccounts && clientInfo.socialAccounts.length > 0 ? (
                  clientInfo.socialAccounts.map((account, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-[#0a0a0b]">{account.platform}</span>
                      <span className="text-[#505056]"> — Login saved</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#505056]">No accounts added</p>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={goToDashboard}
              className="px-6 py-3 bg-[#0a0a0b] text-white rounded-lg font-semibold hover:opacity-85 cursor-pointer"
            >
              Go to Dashboard
            </button>
            <button
              onClick={editOnboarding}
              className="px-6 py-3 border border-[#d3d3d6] text-[#0a0a0b] rounded-lg font-semibold hover:bg-[#f4f4f5] cursor-pointer"
            >
              Edit Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
