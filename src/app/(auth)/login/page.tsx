/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { saveTokens } from "@/service/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState<string | null>(null); // State for backend error responses
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null); // Reset previous API errors

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials or server error.");
      }

      if (data.success && data.data) {
        const accessToken = data.data.access;

        // 1. Save token safely to localStorage
        localStorage.setItem("access_token", accessToken);

        // 2. Pass it to your custom token storage handler (e.g., setting cookies)
        if (typeof saveTokens === "function") {
          await saveTokens(accessToken);
        }

        console.log("Login successful! User:", data.data.user.full_name);

        // 3. Clean routing path to dashboard
        window.location.href = "/dashboard";
      } else {
        throw new Error("Unexpected response structure from server.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setApiError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
            <h1 className='text-2xl font-bold text-blue-900'>SUPERIOR</h1>
            <p className='text-blue-600 font-semibold text-sm'>WORKFORCE</p>
          </div>

          <h2 className='text-3xl font-bold text-gray-800 mb-8'>Log in</h2>

          {/* Global API Error Alert Block */}
          {apiError && (
            <div className='mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md'>
              {apiError}
            </div>
          )}

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
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='flex justify-end'>
              <Link
                href='/forgot-password'
                className='text-sm text-red-500 hover:text-red-600 font-medium transition-colors'
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8'
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>(
//     {},
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   const validateForm = (): boolean => {
//     const newErrors: typeof errors = {};

//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Login attempt:", { email, password });
//       // TODO: Replace with actual login logic
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className='flex min-h-screen bg-white'>
//       {/* Left side - Logo */}
//       <div className='hidden md:flex md:w-1/2 bg-linear-to-b from-blue-100 to-white items-center justify-center p-8'>
//         <div className='text-center'>
//           <div className='mb-6 flex justify-center'>
//             <div className='w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center'>
//               <svg
//                 className='w-24 h-24 text-blue-600'
//                 viewBox='0 0 100 100'
//                 fill='currentColor'
//               >
//                 <circle cx='50' cy='35' r='15' />
//                 <circle cx='30' cy='55' r='12' />
//                 <circle cx='70' cy='55' r='12' />
//                 <ellipse cx='50' cy='75' rx='25' ry='15' />
//               </svg>
//             </div>
//           </div>
//           <h1 className='text-3xl font-bold text-blue-900'>SUPERIOR</h1>
//           <p className='text-blue-600 font-semibold tracking-wider'>
//             WORKFORCE
//           </p>
//         </div>
//       </div>

//       {/* Right side - Form */}
//       <div className='w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8'>
//         <div className='w-full max-w-md'>
//           {/* Mobile Logo */}
//           <div className='md:hidden mb-8 text-center'>
//             <div className='mb-4 flex justify-center'>
//               <div className='w-20 h-20 bg-linear-to-b from-blue-100 to-white rounded-full shadow-lg flex items-center justify-center'>
//                 <svg
//                   className='w-16 h-16 text-blue-600'
//                   viewBox='0 0 100 100'
//                   fill='currentColor'
//                 >
//                   <circle cx='50' cy='35' r='15' />
//                   <circle cx='30' cy='55' r='12' />
//                   <circle cx='70' cy='55' r='12' />
//                   <ellipse cx='50' cy='75' rx='25' ry='15' />
//                 </svg>
//               </div>
//             </div>
//             <h1 className='text-2xl font-bold text-blue-900'>SUPERIOR</h1>
//             <p className='text-blue-600 font-semibold text-sm'>WORKFORCE</p>
//           </div>

//           <h2 className='text-3xl font-bold text-gray-800 mb-8'>Log in</h2>

//           <form onSubmit={handleSubmit} className='space-y-6'>
//             {/* Email Field */}
//             <div>
//               <label
//                 htmlFor='email'
//                 className='block text-sm font-medium text-gray-700 mb-2'
//               >
//                 Email
//               </label>
//               <div className='relative'>
//                 <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
//                 <input
//                   id='email'
//                   type='email'
//                   placeholder='Enter your email'
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     if (errors.email) setErrors({ ...errors, email: "" });
//                   }}
//                   className={`w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
//                     errors.email ? "border-red-500" : ""
//                   }`}
//                 />
//               </div>
//               {errors.email && (
//                 <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label
//                 htmlFor='password'
//                 className='block text-sm font-medium text-gray-700 mb-2'
//               >
//                 Password
//               </label>
//               <div className='relative'>
//                 <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
//                 <input
//                   id='password'
//                   type={showPassword ? "text" : "password"}
//                   placeholder='Enter your password'
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     if (errors.password) setErrors({ ...errors, password: "" });
//                   }}
//                   className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
//                     errors.password ? "border-red-500" : ""
//                   }`}
//                 />
//                 <button
//                   type='button'
//                   onClick={() => setShowPassword(!showPassword)}
//                   className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
//                 >
//                   {showPassword ? (
//                     <EyeOff className='w-5 h-5' />
//                   ) : (
//                     <Eye className='w-5 h-5' />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
//               )}
//             </div>

//             {/* Forgot Password Link */}
//             <div className='flex justify-end'>
//               <Link
//                 href='/forgot-password'
//                 className='text-sm text-red-500 hover:text-red-600 font-medium transition-colors'
//               >
//                 Forgot Password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <button
//               type='submit'
//               disabled={isLoading}
//               className='w-full bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8'
//             >
//               {isLoading ? "LOGGING IN..." : "LOG IN"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
