import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ─── Gọi Gemini API với retry ───
async function callGemini(apiKey: string, prompt: string): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
        }),
      })

      if (res.status === 429) {
        console.log(`[Gemini] Rate limited. Retry ${attempt + 1}/2 after 5s...`)
        await new Promise(r => setTimeout(r, 5000))
        continue
      }

      if (!res.ok) {
        console.error(`[Gemini] Error ${res.status}`)
        return null
      }

      const data = await res.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch {
      console.error('[Gemini] Network error')
      return null
    }
  }
  return null
}

// ─── Fallback: Tìm kiếm sản phẩm bằng từ khóa (khi AI không khả dụng) ───
interface Product {
  name: string
  price: number
  description: string
  category: string
  rating: number
  is_sale: boolean
}

function offlineSearch(query: string, products: Product[]): string {
  const q = query.toLowerCase().trim()

  // Chào hỏi
  if (['chào', 'hi', 'hello', 'xin chào', 'hey'].some(w => q.includes(w))) {
    return '👋 Chào bạn! Tôi là trợ lý NextStore. Bạn muốn tìm sản phẩm gì hôm nay?'
  }

  // Hỏi về sale/khuyến mãi
  if (['sale', 'giảm giá', 'khuyến mãi', 'giảm', 'ưu đãi'].some(w => q.includes(w))) {
    const saleItems = products.filter(p => p.is_sale)
    if (saleItems.length > 0) {
      const list = saleItems.map(p =>
        `🔥 **${p.name}** — ${new Intl.NumberFormat('vi-VN').format(p.price)}đ`
      ).join('\n')
      return `Các sản phẩm đang **giảm giá**:\n${list}`
    }
    return 'Hiện chưa có sản phẩm nào đang sale. Bạn muốn xem sản phẩm nào khác?'
  }

  // Tìm kiếm theo từ khóa
  const stopwords = ['muốn', 'mua', 'cho', 'tôi', 'cần', 'tìm', 'giá', 'bao', 'nhiêu', 'có', 'là', 'không', 'về', 'nó', 'cái', 'tư', 'vấn', 'hỏi', 'xem']
  const keywords = q.split(/\s+/).filter(w => w.length > 1 && !stopwords.includes(w))

  const scored = products.map(p => {
    const name = p.name.toLowerCase()
    const cat = p.category.toLowerCase()
    const desc = (p.description || '').toLowerCase()
    let score = 0

    keywords.forEach(kw => {
      if (name.includes(kw)) score += 50
      if (cat.includes(kw)) score += 30
      if (desc.includes(kw)) score += 10
    })

    if (name.includes(q)) score += 100
    return { ...p, score }
  }).filter(p => p.score > 0).sort((a, b) => b.score - a.score)

  if (scored.length > 0) {
    const top = scored.slice(0, 3)
    const list = top.map(p =>
      `🛒 **${p.name}** — ${new Intl.NumberFormat('vi-VN').format(p.price)}đ\n   ⭐ ${p.rating}/5 | ${p.category}${p.is_sale ? ' | 🔥SALE' : ''}`
    ).join('\n\n')
    return `Tôi tìm thấy ${scored.length} sản phẩm phù hợp:\n\n${list}`
  }

  // Nếu không tìm thấy gì → liệt kê tất cả
  if (['sản phẩm', 'danh sách', 'tất cả', 'có gì', 'bán gì'].some(w => q.includes(w))) {
    const list = products.map(p =>
      `• **${p.name}** — ${new Intl.NumberFormat('vi-VN').format(p.price)}đ`
    ).join('\n')
    return `📦 Tất cả sản phẩm của NextStore:\n${list}`
  }

  return `Tôi chưa tìm thấy sản phẩm phù hợp với "${query}". Bạn có thể thử:\n• Hỏi về danh mục (tai nghe, laptop...)\n• Xem sản phẩm đang sale\n• Xem tất cả sản phẩm`
}

// ─── API Route ───
export async function POST(req: Request) {
  try {
    const { content, userId } = await req.json()

    if (!content || !userId) {
      return NextResponse.json({ error: 'Missing content or userId' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Lấy sản phẩm
    const { data: products } = await supabase
      .from('products')
      .select('name, price, description, category, rating, is_sale')

    const productList = products || []

    // Thử gọi Gemini trước
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      // Lấy lịch sử chat
      const { data: history } = await supabase
        .from('messages')
        .select('content, sender_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(6)

      const chatLines = (history || []).reverse()
        .map(m => `${m.sender_type === 'user' ? 'Khách' : 'Bot'}: ${m.content}`)
        .join('\n')

      const productLines = productList
        .map(p => `• ${p.name} — ${new Intl.NumberFormat('vi-VN').format(p.price)}đ | ${p.category} | ⭐${p.rating}/5${p.is_sale ? ' | SALE' : ''}`)
        .join('\n')

      const prompt = `Bạn là "Next AI" — trợ lý bán hàng NextStore.
Chỉ dùng data sau để trả lời. Tiếng Việt, thân thiện, ngắn gọn, dùng emoji.

SẢN PHẨM:
${productLines}

LỊCH SỬ:
${chatLines}

KHÁCH HỎI: ${content}

TRẢ LỜI:`

      const aiResult = await callGemini(apiKey, prompt)
      if (aiResult) {
        return NextResponse.json({ response: aiResult })
      }
    }

    // Fallback: Tìm kiếm offline
    console.log('[AI Chat] Gemini unavailable, using offline search')
    const fallbackResponse = offlineSearch(content, productList)
    return NextResponse.json({ response: fallbackResponse })

  } catch (error) {
    console.error('[AI Chat] Route Error:', error)
    return NextResponse.json({ response: 'Đã xảy ra lỗi. Vui lòng thử lại!' })
  }
}
