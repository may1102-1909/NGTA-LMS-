'use client' // 👈 CRITICAL: Must be at the very top line!

import React, { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowRight } from 'lucide-react'

export default function LoginButton({
  className = "inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#EFFF4F] text-[#28282B] font-bold text-sm uppercase tracking-wider rounded-full hover:bg-[#EFFF4F]/90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(239,255,79,0.35)] group cursor-pointer",
}: {
  className?: string
}) {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    console.log('Button clicked! Triggering Google Login...') // Test log
    setLoading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/lms`,
      },
    })

    if (error) {
      console.error('Supabase Auth Error:', error.message)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleGoogleLogin}
      disabled={loading}
      className={className}
    >
      <span>{loading ? 'CONNECTING TO GOOGLE...' : 'ENTER LMS PLATFORM ->'}</span>
      {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
    </button>
  )
}
