'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ChatInterface from '@/components/ChatInterface'
import { Loader2, Bot, Shield, Zap, Sparkles } from 'lucide-react'
import { Session } from '@supabase/supabase-js'

export default function ChatPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        router.push('/auth/login')
      } else {
        setSession(session)
      }
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth/login')
      } else {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium text-sm">Đang xác thực...</p>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
            <Sparkles className="h-3 w-3" />
            NextStore Smart Support
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Trợ Lý AI Thông Minh
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Được hỗ trợ bởi công nghệ AI tiên tiến, tư vấn sản phẩm nhanh chóng và chính xác.
          </p>
        </div>

        {/* Chat container with glow */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-[28px] blur-xl" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
            <ChatInterface userId={session.user.id} />
          </div>
        </div>

        {/* Features badges */}
        <div className="flex justify-center items-center gap-6 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">AI Powered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Bảo mật</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Siêu nhanh</span>
          </div>
        </div>
      </div>
    </div>
  )
}
