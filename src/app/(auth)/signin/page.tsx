'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Cookies from 'js-cookie';
type SignInFormState = {
  email: string;
  password: string;
};

type ChangePasswordFormState = {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SignInPage(): React.ReactElement {
  const [formState, setFormState] = useState<SignInFormState>({
    email: '',
    password: '',
  });
  
  const [changePasswordState, setChangePasswordState] = useState<ChangePasswordFormState>({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const router = useRouter();

  function updateField(field: keyof SignInFormState, value: string): void {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function updateChangePasswordField(field: keyof ChangePasswordFormState, value: string): void {
    setChangePasswordState((prev) => ({ ...prev, [field]: value }));
  }

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    return errors;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formState.email || !formState.password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          throw new Error('Please enter correct email and password.');
        }
        throw new Error(data.message || 'Sign in failed');
      }

      Cookies.set('authToken', data.token);
      
      console.log('Sign in successful:', data.user);
      router.replace('/admin');
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleChangePassword(event: React.FormEvent): Promise<void> {
    event.preventDefault(); // Add this to prevent default form behavior
    setErrorMessage('');
    setSuccessMessage('');
console.log('Change password state:', changePasswordState);
    // Validation
    // if (!changePasswordState.email || !changePasswordState.oldPassword || 
    //     !changePasswordState.newPassword || !changePasswordState.confirmPassword) {
    //   setErrorMessage('All fields are required.');
    //   return;
    // }

    // const passwordErrors = validatePassword(changePasswordState.newPassword);
    // if (passwordErrors.length > 0) {
    //   setErrorMessage(passwordErrors.join(', '));
    //   return;
    // }

    // if (changePasswordState.newPassword !== changePasswordState.confirmPassword) {
    //   setErrorMessage('New passwords do not match.');
    //   return;
    // }

    // if (changePasswordState.oldPassword === changePasswordState.newPassword) {
    //   setErrorMessage('New password cannot be the same as old password.');
    //   return;
    // }

    try {
      setIsChangingPassword(true);
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`;
      console.log('Making request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: changePasswordState.email,
          oldPassword: changePasswordState.oldPassword,
          newPassword: changePasswordState.newPassword,
        }),
      });

      const data = await response.json();
      console.log('Change password response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccessMessage('Password changed successfully! You can now sign in with your new password.');
      
      // Pre-fill the email in login form
      setFormState(prev => ({ ...prev, email: changePasswordState.email }));
      
      // Clear password fields in login form for security
      setFormState(prev => ({ ...prev, password: '' }));
      
      // Close modal after successful change
      setTimeout(() => {
        setShowChangePassword(false);
        setChangePasswordState({
          email: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }, 3000);
      
    } catch (error) {
      console.error('Change password error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  }

  const closeModal = (): void => {
    setShowChangePassword(false);
    setErrorMessage('');
    setSuccessMessage('');
    setChangePasswordState({
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-2 text-center">Sign in</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Welcome back! Please enter your details to continue.</p>

        {errorMessage ? (
          <div role="alert" className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div role="alert" className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded border border-green-200">
            {successMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={formState.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your password"
                value={formState.password}
                onChange={(e) => updateField('password', e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 cursor-pointer text-white py-2.5 font-semibold disabled:opacity-60 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors mb-4"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowChangePassword(true)}
              className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Wrap the form around the modal content */}
            <form onSubmit={handleChangePassword} noValidate>
              <div>
                <p className="text-gray-600 mb-4">
                  Enter your email, old password, and new password to change your password.
                </p>

                <div className="mb-4">
                  <label htmlFor="change-email" className="block mb-1 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="change-email"
                    type="email"
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    value={changePasswordState.email}
                    onChange={(e) => updateChangePasswordField('email', e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="old-password" className="block mb-1 text-sm font-medium">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      id="old-password"
                      type={showOldPassword ? "text" : "password"}
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your old password"
                      value={changePasswordState.oldPassword}
                      onChange={(e) => updateChangePasswordField('oldPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="new-password" className="block mb-1 text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                      value={changePasswordState.newPassword}
                      onChange={(e) => updateChangePasswordField('newPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block mb-1 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                      value={changePasswordState.confirmPassword}
                      onChange={(e) => updateChangePasswordField('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full rounded-lg bg-blue-600 cursor-pointer text-white py-2.5 font-semibold disabled:opacity-60 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
                >
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}