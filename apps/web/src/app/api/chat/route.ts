// @ts-nocheck
import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai'; // ✅ bỏ UIMessage
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // ✅ KHÔNG có await trước streamText
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content || ''
      })),
      system: `Bạn là Omi, trợ lý y khoa AI của hệ thống MedAI Pro. 
Giọng điệu: Chuyên nghiệp, ân cần, cực kỳ ngắn gọn (chỉ 2-3 câu).
Nhiệm vụ: Hỏi bệnh nhân về triệu chứng -> Đưa ra lời khuyên MẸO VẶT sức khoẻ chung chung -> BẮT BUỘC gọi công cụ 'searchProducts' với từ khoá là tên loại CHỨNG BỆNH (vd: 'Cảm cúm', 'Đau đầu', 'Ho đờm') hoặc TÊN thuốc nếu người dùng nhắc đến.
1. KHI gọi searchProducts, bạn sẽ nhận được danh sách thuốc.
2. NẾU tìm thấy thuốc: BẮT BUỘC phải gọi công cụ 'addToCart' với id và tên thuốc ĐẦU TIÊN trong danh sách để đẩy UI card cho người dùng thêm thuốc vào Giỏ Hàng. Xong bước này mới trả lời câu chốt.
Lưu ý: Tuyệt đối không tư vấn các loại thuốc không có trong kết quả tìm kiếm. QUAN TRỌNG: Sau khi searchProducts trả về kết quả, BẮT BUỘC ngay lập tức gọi addToCart với sản phẩm đầu tiên. KHÔNG được dừng lại.`,
      tools: {
        searchProducts: tool({
          description: 'Tìm kiếm thuốc. LUÔN LUÔN truyền keyword là tên chứng bệnh. Ví dụ: keyword="Đau đầu", keyword="Cảm cúm", keyword="Ho".',
          parameters: z.object({
            keyword: z.string().optional(),
            keywords: z.string().optional(),
          }),
          execute: async ({ keyword, keywords }) => {
            const kw = keyword || keywords || '';
            const firstWord = kw.split(' ')[0] || kw;
            const { data, error } = await supabase
              .from('products')
              .select('id, name, description, category_id')
              .or(`name.ilike.%${firstWord}%,description.ilike.%${firstWord}%`)
              .limit(3);
            if (error) return { error: error.message };
            return data || [];
          },
        }),
        addToCart: tool({
          description: 'Đề xuất khách hàng thêm NGAY 1 loại thuốc vào giỏ hàng.',
          parameters: z.object({
            product_id: z.string().describe('ID của thuốc (UUID lấy từ search)'),
            product_name: z.string().describe('Tên thuốc'),
          }),
          execute: async ({ product_id, product_name }) => {
            return { success: true, message: `Đã render nút thêm ${product_name} vào giỏ hàng.` };
          }
        })
      },
      experimental_continueSteps: true,
      maxSteps: 3,
    });

    // ✅ method đúng cho v6
    return result.toUIMessageStreamResponse({
      sendStepFinishEvents: true,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}