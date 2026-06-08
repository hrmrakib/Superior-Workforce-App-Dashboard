"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP sent to:", email);
      setIsSubmitted(true);
      setError("");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className='flex min-h-screen bg-white'>
        {/* Left side - Logo */}
        <div className='hidden md:flex md:w-1/2 bg-linear-to-b from-blue-100 to-white items-center justify-center p-8'>
          <div className='text-center'>
            <div className='mb-6 flex justify-center'>
              <div className='w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center'>
                <svg
                  className='w-24 h-24 text-blue-600'
                  viewBox='0 0 100 100'
                  fill='currentColor'
                >
                  <circle cx='50' cy='35' r='15' />
                  <circle cx='30' cy='55' r='12' />
                  <circle cx='70' cy='55' r='12' />
                  <ellipse cx='50' cy='75' rx='25' ry='15' />
                </svg>
              </div>
            </div>
            <h1 className='text-3xl font-bold text-blue-900'>SUPERIOR</h1>
            <p className='text-blue-600 font-semibold tracking-wider'>
              WORKFORCE
            </p>
          </div>
        </div>

        {/* Right side - Success Message */}
        <div className='w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8'>
          <div className='w-full max-w-md text-center'>
            <div className='mb-8'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                OTP Sent Successfully
              </h2>
              <p className='text-gray-600 mb-4'>
                We&apos;ve sent a verification code to{" "}
                <span className='font-semibold text-gray-800'>{email}</span>
              </p>
              <p className='text-sm text-gray-500 mb-6'>
                Check your email and enter the code to continue resetting your
                password.
              </p>
            </div>

            <Link
              href='/verify-email'
              className='inline-block bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200'
            >
              Go to Verification
            </Link>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className='block w-full mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              Send OTP to different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left side - Logo */}
      <div className='hidden md:flex md:w-1/2 bg-linear-to-b from-blue-100 to-white items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center'>
              <svg
                className='w-24 h-24 text-blue-600'
                viewBox='0 0 100 100'
                fill='currentColor'
              >
                <circle cx='50' cy='35' r='15' />
                <circle cx='30' cy='55' r='12' />
                <circle cx='70' cy='55' r='12' />
                <ellipse cx='50' cy='75' rx='25' ry='15' />
              </svg>
            </div>
          </div>
          <h1 className='text-3xl font-bold text-blue-900'>SUPERIOR</h1>
          <p className='text-blue-600 font-semibold tracking-wider'>
            WORKFORCE
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className='w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8'>
        <div className='w-full max-w-md'>
          {/* Mobile Logo */}
          <div className='md:hidden mb-8 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='w-20 h-20 bg-linear-to-b from-blue-100 to-white rounded-full shadow-lg flex items-center justify-center'>
                <svg
                  className='w-16 h-16 text-blue-600'
                  viewBox='0 0 100 100'
                  fill='currentColor'
                >
                  <circle cx='50' cy='35' r='15' />
                  <circle cx='30' cy='55' r='12' />
                  <circle cx='70' cy='55' r='12' />
                  <ellipse cx='50' cy='75' rx='25' ry='15' />
                </svg>
              </div>
            </div>
          </div>

          {/* Header with Back Button */}
          <div className='flex items-center mb-8'>
            <Link
              href='/login'
              className='mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Go back'
            >
              <ArrowLeft className='w-6 h-6 text-gray-700' />
            </Link>
            <h2 className='text-3xl font-bold text-gray-800'>
              Forgot Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                    error ? "border-red-500" : ""
                  }`}
                />
              </div>
              {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8'
            >
              {isLoading ? "SENDING OTP..." : "SEND OTP"}
            </button>
          </form>

          {/* Back to Login */}
          <p className='text-center text-gray-600 mt-6'>
            <Link
              href='/login'
              className='text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
