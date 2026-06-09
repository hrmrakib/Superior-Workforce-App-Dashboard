/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/features/auth/authAPI";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  match?: string;
  apiErrors?: string[]; // Added to capture multi-line backend errors array
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Hook up your RTK Mutation hook and capture its native loading boolean state
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      // Adjusted from 6 to 8 to proactively align with your backend validation rules
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.match = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Wipe out stale errors

    if (!validateForm()) return;

    try {
      // Send key payload variable formatted exactly as your backend expects: { new_password }
      const response = await resetPassword({ new_password: password }).unwrap();

      console.log("Reset Password Success:", response);
      if (response.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error("Reset Password Error Details:", err);

      // Parse detailed validation arrays (err.data.errors) or base fallback messages from payload response
      const serverValidationErrors = err?.data?.errors;
      const generalFallbackMessage =
        err?.data?.message || err?.message || "Failed to update your password.";

      setErrors({
        apiErrors: Array.isArray(serverValidationErrors)
          ? serverValidationErrors
          : [generalFallbackMessage],
      });
    }
  };

  if (isSuccess) {
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
                Password Reset Successfully
              </h2>
              <p className='text-gray-600 mb-6'>
                Your password has been reset successfully. You can now log in
                with your new password.
              </p>
            </div>

            <Link
              href='/login'
              className='inline-block bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200'
            >
              Back to Login
            </Link>
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
              {/* Fixed Tailwind CSS ClassName syntax typo: 'bg-linear-gradient-to-b' to 'bg-linear-to-b' */}
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
              href='/auth/verify-email'
              className='mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Go back'
            >
              <ArrowLeft className='w-6 h-6 text-gray-700' />
            </Link>
            <h2 className='text-3xl font-bold text-gray-800'>Reset Password</h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Global API Server Errors Display block */}
            {errors.apiErrors && errors.apiErrors.length > 0 && (
              <div className='p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg space-y-1'>
                <p className='text-sm font-semibold text-red-800'>
                  Password Update Denied:
                </p>
                <ul className='list-disc list-inside text-xs text-red-700 space-y-0.5'>
                  {errors.apiErrors.map((message, i) => (
                    <li key={i}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

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
                  placeholder='Enter new password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password || errors.match) {
                      setErrors({
                        ...errors,
                        password: "",
                        match: "",
                      });
                    }
                  }}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.password || errors.match ? "border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Confirm Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  id='confirmPassword'
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword || errors.match) {
                      setErrors({
                        ...errors,
                        confirmPassword: "",
                        match: "",
                      });
                    }
                  }}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.confirmPassword || errors.match
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.confirmPassword}
                </p>
              )}
              {errors.match && (
                <p className='text-red-500 text-sm mt-1'>{errors.match}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8'
            >
              {isLoading ? "SAVING CHANGES..." : "SAVE CHANGES"}
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
// import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
// import { useResetPasswordMutation } from "@/redux/features/auth/authAPI";

// interface FormErrors {
//   password?: string;
//   confirmPassword?: string;
//   match?: string;
// }

// export default function ResetPasswordPage() {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [resetPasswordMutation] = useResetPasswordMutation();

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!confirmPassword.trim()) {
//       newErrors.confirmPassword = "Please confirm your password";
//     }

//     if (password && confirmPassword && password !== confirmPassword) {
//       newErrors.match = "Passwords do not match";
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
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       console.log("Password reset successful");
//       setIsSuccess(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isSuccess) {
//     return (
//       <div className='flex min-h-screen bg-white'>
//         {/* Left side - Logo */}
//         <div className='hidden md:flex md:w-1/2 bg-linear-to-b from-blue-100 to-white items-center justify-center p-8'>
//           <div className='text-center'>
//             <div className='mb-6 flex justify-center'>
//               <div className='w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center'>
//                 <svg
//                   className='w-24 h-24 text-blue-600'
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
//             <h1 className='text-3xl font-bold text-blue-900'>SUPERIOR</h1>
//             <p className='text-blue-600 font-semibold tracking-wider'>
//               WORKFORCE
//             </p>
//           </div>
//         </div>

//         {/* Right side - Success Message */}
//         <div className='w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8'>
//           <div className='w-full max-w-md text-center'>
//             <div className='mb-8'>
//               <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
//                 <svg
//                   className='w-8 h-8 text-green-600'
//                   fill='currentColor'
//                   viewBox='0 0 20 20'
//                 >
//                   <path
//                     fillRule='evenodd'
//                     d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
//                     clipRule='evenodd'
//                   />
//                 </svg>
//               </div>
//               <h2 className='text-2xl font-bold text-gray-800 mb-2'>
//                 Password Reset Successfully
//               </h2>
//               <p className='text-gray-600 mb-6'>
//                 Your password has been reset successfully. You can now log in
//                 with your new password.
//               </p>
//             </div>

//             <Link
//               href='/auth/login'
//               className='inline-block bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200'
//             >
//               Back to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

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
//               <div className='w-20 h-20 bg-linear-gradient-to-b from-blue-100 to-white rounded-full shadow-lg flex items-center justify-center'>
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
//           </div>

//           {/* Header with Back Button */}
//           <div className='flex items-center mb-8'>
//             <Link
//               href='/auth/verify-email'
//               className='mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors'
//               aria-label='Go back'
//             >
//               <ArrowLeft className='w-6 h-6 text-gray-700' />
//             </Link>
//             <h2 className='text-3xl font-bold text-gray-800'>Reset Password</h2>
//           </div>

//           <form onSubmit={handleSubmit} className='space-y-6'>
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
//                   placeholder='Enter new password'
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     if (errors.password || errors.match) {
//                       setErrors({
//                         ...errors,
//                         password: "",
//                         match: "",
//                       });
//                     }
//                   }}
//                   className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
//                     errors.password || errors.match ? "border-red-500" : ""
//                   }`}
//                 />
//                 <button
//                   type='button'
//                   onClick={() => setShowPassword(!showPassword)}
//                   className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
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

//             {/* Confirm Password Field */}
//             <div>
//               <label
//                 htmlFor='confirmPassword'
//                 className='block text-sm font-medium text-gray-700 mb-2'
//               >
//                 Confirm Password
//               </label>
//               <div className='relative'>
//                 <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
//                 <input
//                   id='confirmPassword'
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder='Confirm your password'
//                   value={confirmPassword}
//                   onChange={(e) => {
//                     setConfirmPassword(e.target.value);
//                     if (errors.confirmPassword || errors.match) {
//                       setErrors({
//                         ...errors,
//                         confirmPassword: "",
//                         match: "",
//                       });
//                     }
//                   }}
//                   className={`w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
//                     errors.confirmPassword || errors.match
//                       ? "border-red-500"
//                       : ""
//                   }`}
//                 />
//                 <button
//                   type='button'
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className='w-5 h-5' />
//                   ) : (
//                     <Eye className='w-5 h-5' />
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className='text-red-500 text-sm mt-1'>
//                   {errors.confirmPassword}
//                 </p>
//               )}
//               {errors.match && (
//                 <p className='text-red-500 text-sm mt-1'>{errors.match}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type='submit'
//               disabled={isLoading}
//               className='w-full bg-linear-to-r from-blue-700 to-teal-600 text-white font-bold py-3 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8'
//             >
//               {isLoading ? "SAVING CHANGES..." : "SAVE CHANGES"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
