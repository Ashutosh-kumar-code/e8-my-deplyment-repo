'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

type Step = 'password' | 'profile';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Password step
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile step
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const [currentStep, setCurrentStep] = useState<Step>('password');
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tokenValid, setTokenValid] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error('Invalid or missing invitation link');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-invite-token?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setEmail(data.email);
          setFullName(data.name || '');
          setTokenValid(true);
        } else {
          toast.error(data.message || 'Invitation link is invalid or expired');
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        toast.error('Failed to verify invitation link');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('Password must contain an uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('Password must contain a lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('Password must contain a number');
    if (!/[!@#$%^&*]/.test(pwd)) errors.push('Password must contain a special character (!@#$%^&*)');
    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!password) errors.push('Password is required');
    if (password !== confirmPassword) errors.push('Passwords do not match');

    const pwdErrors = validatePassword(password);
    errors.push(...pwdErrors);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setCurrentStep('profile');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!fullName.trim()) errors.push('Full name is required');
    if (!companyName.trim()) errors.push('Company name is required');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password,
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          phone: phone.trim(),
          website: website.trim(),
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!');
        setTimeout(() => {
          router.push('/complete-client-info');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to create account');
      }
    } catch (err) {
      console.error('Error completing onboarding:', err);
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8">
            <div className="text-center space-y-3">
              <div className="inline-block">
                <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
              </div>
              <p className="text-gray-600">Verifying your invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900">Invalid Invitation</h2>
              <p className="text-gray-600">This invitation link is invalid or has expired. Please contact your account manager to request a new invitation.</p>
              <Button onClick={() => router.push('/login')} className="w-full mt-4">
                Return to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Complete Your Account Setup</CardTitle>
          <CardDescription>Welcome to E8 Productions! Set up your account and company profile.</CardDescription>
        </CardHeader>

        <CardContent>
          {currentStep === 'password' ? (
            // PASSWORD STEP
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {validationErrors.length > 0 && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                      {validationErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Continue to Profile Setup
              </Button>
            </form>
          ) : (
            // PROFILE STEP WITH TABS
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {validationErrors.length > 0 && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                      {validationErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[400px]">
                {/* Left Sidebar - Tabs */}
                <div className="lg:col-span-1">
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg sticky top-4">
                    <h3 className="font-semibold text-sm text-gray-700 mb-4">Setup Sections</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('general')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === 'general'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      General Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('company')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === 'company'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Company Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === 'contact'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Contact Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('location')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === 'location'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Location
                    </button>
                  </div>
                </div>

                {/* Right Content - Tab Content */}
                <div className="lg:col-span-3 space-y-4">
                  {/* General Info Tab */}
                  {activeTab === 'general' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Personal Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email2">Email Address</Label>
                        <Input
                          id="email2"
                          type="email"
                          value={email}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Company Info Tab */}
                  {activeTab === 'company' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Company Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Your Company Inc."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://example.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Contact Details Tab */}
                  {activeTab === 'contact' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Contact Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="123 Main Street"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Location Tab */}
                  {activeTab === 'location' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="New York"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          type="text"
                          placeholder="United States"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('password')}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8">
            <div className="text-center space-y-3">
              <div className="inline-block">
                <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
              </div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
