'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import {
  Bot, Send, Sparkles, Trash2, Loader2,
  ShoppingCart, Zap, Tag, ChevronDown,
  Clock, CheckCheck, MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  user_id: string
  content: string
  sender_type: 'user' | 'ai'
  created_at: string
}

export default function ChatInterface({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // ─── Load lịch sử + Realtime ───
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      const msgs = data || []
      setMessages(msgs)
      setMsgCount(msgs.filter(m => m.sender_type === 'user').length)
    }
    load()

    const channel = supabase
      .channel(`chat-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` },
        (payload) => {
          const msg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev
            if (msg.sender_type === 'user') {
              const hasTempDuplicate = prev.some(
                (m) => m.id.startsWith('temp-') && m.content === msg.content
              )
              if (hasTempDuplicate) {
                return prev.map((m) =>
                  m.id.startsWith('temp-') && m.content === msg.content ? msg : m
                )
              }
            }
            return [...prev, msg]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  // ─── Auto-scroll ───
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, typing, scrollToBottom])

  // ─── Scroll detection ───
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100)
  }

  // ─── Xóa lịch sử ───
  const handleClear = async () => {
    if (!confirm('🗑️ Xóa toàn bộ lịch sử chat?')) return
    setClearing(true)
    await supabase.from('messages').delete().eq('user_id', userId)
    setMessages([])
    setMsgCount(0)
    setClearing(false)
  }

  // ─── Gửi tin nhắn ───
  const handleSend = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    setInput('')

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      content: msg,
      sender_type: 'user',
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])
    setMsgCount((c) => c + 1)

    await supabase.from('messages').insert([
      { user_id: userId, content: msg, sender_type: 'user' },
    ])

    setTyping(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msg, userId }),
      })
      const data = await res.json()
      if (data.response) {
        await supabase.from('messages').insert([
          { user_id: userId, content: data.response, sender_type: 'ai' },
        ])
      }
    } catch (err) {
      console.error('AI error:', err)
    } finally {
      setTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  return (
    <div className="flex flex-col h-[500px] w-full bg-white overflow-hidden">
      {/* ══════════ HEADER ══════════ */}
      <div className="relative shrink-0 overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDBjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="relative px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar with status ring */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center ring-2 ring-white/10 ring-offset-2 ring-offset-blue-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-blue-600 shadow-lg shadow-emerald-400/50" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
                Next AI
                <Sparkles className="h-3 w-3 text-cyan-300 animate-pulse" />
              </h2>
              <div className="flex items-center gap-1.5">
                {typing ? (
                  <span className="text-cyan-200 text-[10px] font-medium flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-300" />
                    </span>
                    Đang trả lời...
                  </span>
                ) : (
                  <span className="text-blue-200 text-[10px] font-medium">Trợ lý AI · Hoạt động</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Message counter badge */}
            {msgCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 mr-1">
                <MessageCircle className="h-3 w-3 text-blue-200" />
                <span className="text-[10px] text-blue-100 font-bold">{msgCount}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={clearing || messages.length === 0}
              className="text-white/40 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8 transition-all"
            >
              {clearing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* ══════════ MESSAGES ══════════ */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4 relative scroll-smooth"
      >
        <div className="flex flex-col gap-3">
          {messages.length === 0 && !typing && <EmptyState onSelect={handleSend} />}

          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              message={m}
              showAvatar={i === 0 || messages[i - 1]?.sender_type !== m.sender_type}
              isLast={i === messages.length - 1}
            />
          ))}

          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform z-10"
          >
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        )}
      </div>

      {/* ══════════ QUICK ACTIONS ══════════ */}
      {messages.length > 0 && messages.length < 4 && !typing && (
        <div className="px-3 py-2 bg-white border-t border-slate-50 flex gap-1.5 overflow-x-auto shrink-0">
          {[
            { icon: Tag, label: 'Đang sale', color: 'text-red-500' },
            { icon: ShoppingCart, label: 'Tất cả SP', color: 'text-blue-500' },
            { icon: Zap, label: 'SP hot nhất', color: 'text-amber-500' },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={() => handleSend(label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 whitespace-nowrap transition-all active:scale-95 shrink-0"
            >
              <Icon className={cn('h-3 w-3', color)} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ══════════ INPUT ══════════ */}
      <div className="px-3 py-2.5 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={typing ? 'AI đang trả lời...' : 'Nhập câu hỏi của bạn...'}
              disabled={typing}
              maxLength={500}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/80 pl-4 pr-20 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400 disabled:opacity-50"
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center">
              {input.length > 0 && (
                <span className={cn(
                  'text-[9px] font-medium transition-colors',
                  input.length > 400 ? 'text-red-400' : 'text-slate-300'
                )}>
                  {input.length}/500
                </span>
              )}
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={typing || !input.trim()}
              className={cn(
                'absolute right-1 top-1 h-8 w-8 rounded-lg border-none shadow transition-all',
                input.trim()
                  ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white hover:shadow-blue-300 hover:scale-105 active:scale-95'
                  : 'bg-slate-100 text-slate-300'
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
        <div className="flex items-center justify-center mt-1.5">
          <span className="text-[9px] text-slate-300 font-medium flex items-center gap-1">
            <Zap className="h-2.5 w-2.5" />
            Powered by NextStore AI
          </span>
        </div>
      </div>
    </div>
  )
}

// ══════════ EMPTY STATE ══════════
function EmptyState({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      {/* Animated bot icon */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-0.5">Xin chào! 👋</h3>
      <p className="text-slate-400 text-[11px] max-w-[220px] mb-5 leading-relaxed">
        Tôi là <span className="font-bold text-blue-600">Next AI</span> — trợ lý mua sắm thông minh. Hãy hỏi tôi bất cứ điều gì!
      </p>

      {/* Suggestion grid */}
      <div className="grid grid-cols-1 gap-1.5 w-full max-w-[280px]">
        {[
          { icon: Tag, text: 'Sản phẩm đang giảm giá?', color: 'text-red-500 bg-red-50' },
          { icon: ShoppingCart, text: 'Tư vấn laptop phù hợp', color: 'text-blue-500 bg-blue-50' },
          { icon: Zap, text: 'Tai nghe gaming tốt nhất?', color: 'text-amber-500 bg-amber-50' },
        ].map(({ icon: Icon, text, color }) => (
          <button
            key={text}
            onClick={() => onSelect(text)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-100 text-left hover:border-blue-300 hover:shadow-sm transition-all active:scale-[0.98] group"
          >
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', color)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[12px] font-medium text-slate-600 group-hover:text-blue-700 transition-colors">{text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ══════════ TYPING INDICATOR ══════════
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms] [animation-duration:1.4s]" />
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:200ms] [animation-duration:1.4s]" />
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:400ms] [animation-duration:1.4s]" />
          </div>
          <span className="text-[10px] text-slate-400 ml-2 font-medium">Đang suy nghĩ...</span>
        </div>
      </div>
    </div>
  )
}

// ══════════ MESSAGE BUBBLE ══════════
function MessageBubble({
  message,
  showAvatar,
  isLast,
}: {
  message: Message
  showAvatar: boolean
  isLast: boolean
}) {
  const isAi = message.sender_type === 'ai'
  const isTemp = message.id.startsWith('temp-')

  // Markdown-like formatting
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-indigo-600">$1</code>')
      .replace(/^• (.+)$/gm, '<li class="flex items-start gap-1.5 ml-1"><span class="text-blue-400 mt-0.5">•</span><span>$1</span></li>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className={cn(
      'flex w-full gap-2',
      isAi ? 'justify-start' : 'justify-end',
      !showAvatar && isAi && 'pl-9'
    )}>
      {/* AI Avatar */}
      {isAi && showAvatar && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className={cn('max-w-[78%] flex flex-col', isAi ? 'items-start' : 'items-end')}>
        <div
          className={cn(
            'px-3.5 py-2.5 text-[13px] leading-relaxed transition-all',
            isAi
              ? 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm'
              : cn(
                  'text-white rounded-2xl rounded-br-sm shadow-sm',
                  isTemp
                    ? 'bg-blue-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                )
          )}
        >
          {isAi ? (
            <div
              className="[&_strong]:font-semibold [&_strong]:text-slate-900 [&_li]:py-0.5"
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
          ) : (
            <span>{message.content}</span>
          )}
        </div>

        {/* Message meta */}
        <div className={cn('flex items-center gap-1 mt-1 px-1', isAi ? '' : 'flex-row-reverse')}>
          <Clock className="h-2.5 w-2.5 text-slate-300" />
          <span className="text-[9px] text-slate-400 font-medium">
            {new Date(message.created_at).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!isAi && (
            <CheckCheck className={cn('h-3 w-3', isTemp ? 'text-slate-300' : 'text-blue-400')} />
          )}
        </div>
      </div>
    </div>
  )
}
