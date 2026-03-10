'use client'

import { useState, useEffect } from 'react'
import { X, Bot, Sparkles, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ChatInterface from '@/components/ChatInterface'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Session } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* ── Chat Panel ── */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] animate-in slide-in-from-bottom-6 zoom-in-95 fade-in duration-300 pointer-events-auto">
          {/* Glass card */}
          <div className="rounded-3xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] border border-white/50 bg-white">
            {session ? (
              <ChatInterface userId={session.user.id} />
            ) : (
              /* ── Login Prompt ── */
              <div className="p-8 text-center bg-gradient-to-b from-slate-50 to-white min-h-[380px] flex flex-col items-center justify-center">
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-400 rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-[3px] border-white flex items-center justify-center shadow-lg">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1.5 tracking-tight">Next AI Assistant</h3>
                <p className="text-slate-500 text-xs max-w-[220px] leading-relaxed mb-6">
                  Đăng nhập để trò chuyện với trợ lý mua sắm thông minh của chúng tôi.
                </p>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="w-full max-w-[200px]">
                  <Button className="w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm">
                    Đăng nhập ngay
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Toggle Button ── */}
      <div className="relative pointer-events-auto group">
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl text-[10px] font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            AI Online
            <div className="absolute top-full right-5 w-2.5 h-2.5 bg-slate-900 rotate-45 -translate-y-1" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative flex items-center justify-center h-14 w-14 rounded-2xl transition-all duration-500 border-0 outline-none active:scale-90 shadow-xl',
            isOpen
              ? 'bg-slate-800 rotate-180 shadow-slate-900/30'
              : 'bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 hover:scale-110 hover:-translate-y-0.5 shadow-blue-600/40'
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <>
              {/* Ping aura */}
              <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity animate-pulse" />

              <div className="relative">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>

              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-black text-white">AI</span>
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
