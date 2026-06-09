/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyOtpMutation } from "@/redux/features/auth/authAPI";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");

  // Destructure the RTK mutation and its auto-loading boolean property
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, OTP_LENGTH);

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < OTP_LENGTH) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);

      const nextIndex = newOtp.findIndex((val) => !val);
      focusInput(nextIndex === -1 ? OTP_LENGTH - 1 : nextIndex);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError(
        "Missing identity parameter. Please return to the forgot password screen.",
      );
      return;
    }

    if (!isComplete) {
      setError("Please enter all 6 digits");
      return;
    }

    const otpCode = otp.join("");

    try {
      // Execute the request payload: { email, otp }
      const response = await verifyOtp({ email, otp: otpCode }).unwrap();

      console.log("Verification Success:", response);

      if (response.success && response.data) {
        // Store your payload's auth token safely
        localStorage.setItem("access_token", response.data.access);

        // Push cleanly onto the next secure view state step
        router.push(`/reset-password`);
      }
    } catch (err: any) {
      console.error("Verification Error:", err);

      // Pull dynamic fail strings like "Your OTP has expired..." right out of your JSON structure
      const errorMessage =
        err?.data?.message || err?.message || "Invalid validation code.";
      setError(errorMessage);
    }
  };

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
              href='/forgot-password'
              className='mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Go back'
            >
              <ArrowLeft className='w-6 h-6 text-gray-700' />
            </Link>
            <h2 className='text-3xl font-bold text-gray-800'>Verify Email</h2>
          </div>

          {/* Info Text */}
          <p className='text-gray-600 mb-8'>
            We&apos;ve sent a verification code to{" "}
            <span className='text-blue-600 font-semibold'>
              {email || "your email"}
            </span>
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* OTP Input Fields */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-4'>
                Verification Code
              </label>
              <div className='flex gap-2 sm:gap-3 justify-center mb-6'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    placeholder='0'
                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                      error ? "border-red-500" : ""
                    }`}
                    autoComplete='off'
                  />
                ))}
              </div>
              {error && (
                <p className='text-red-500 text-sm text-center max-w-sm mx-auto leading-relaxed'>
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={!isComplete || isLoading}
              className='w-full bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? "VERIFYING..." : "VERIFY NOW"}
            </button>
          </form>

          {/* Resend Code */}
          <div className='text-center mt-8'>
            <p className='text-gray-600 text-sm'>
              Didn&apos;t receive the code?{" "}
              <button
                type='button'
                className='text-blue-600 hover:text-blue-700 font-medium transition-colors'
              >
                Resend OTP
              </button>
            </p>
            <p className='text-gray-500 text-xs mt-2'>
              Code expires in <span className='font-semibold'>05:00</span>
            </p>
          </div>

          {/* Back to Login */}
          <p className='text-center text-gray-600 mt-6'>
            <Link
              href='/auth/login'
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
