'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema } from '@/lib/validations'

function Login() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    // 1. Prevent default behavior immediately to stop URL leakage
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 2. Validate input
    const validationResult = loginSchema.safeParse({ email, password })
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message)
      setLoading(false)
      return
    }

    try {
      // 3. Perform Login
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

     
      if (!res.ok) {
        setError(data.error || 'Invalid email or password.')
        setLoading(false)
        return
      }
      await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
     router.push(`/auth/verify?email=${encodeURIComponent(email)}`);

    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white p-8">
        <div className="mb-8">
          <div className="w-14 h-14 p-2 mb-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-start">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold font-sans text-gray-900 text-center">
            Start Tracking
          </h1>
          <p className="mt-2 text-sm text-gray-600 text-center font-sans">
            Welcome back! Log in to manage your tasks and keep everything on track.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* method="POST" is a fallback safety measure */}
          <form onSubmit={handleLogin} method="POST" className="mt-6 flex flex-col gap-4 font-sans">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            New user?{" "}
            <Link href="/auth/signUp" className="text-gray-900 hover:underline font-medium">
              Create an account
            </Link>
          </div>

          <div className="mt-2 text-center text-sm text-gray-600">
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login