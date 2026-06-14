'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin/dashboard'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        setError('Password salah. Coba lagi.')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="••••••••"
          required
          autoFocus
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? 'Memverifikasi...' : 'Masuk'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Admin Panel</h1>
          <p className="text-stone-500 text-sm mt-1">Masukkan password untuk melanjutkan</p>
        </div>
        <Suspense fallback={<div className="h-32 animate-pulse bg-stone-100 rounded-lg" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
