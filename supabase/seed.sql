-- Xóa dữ liệu cũ nếu có
TRUNCATE TABLE public.disease_product, public.diseases, public.symptoms, public.products, public.categories RESTART IDENTITY CASCADE;

-- 1. Insert Categories (Danh Mục Chuyên Khoa Thực Tế)
INSERT INTO public.categories (id, name) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Thuốc Kháng Sinh & Kháng Nấm'),
('c2222222-2222-2222-2222-222222222222', 'Thuốc Tiêu Hóa & Dạ Dày'),
('c3333333-3333-3333-3333-333333333333', 'Thuốc Tim Mạch & Huyết Áp'),
('c4444444-4444-4444-4444-444444444444', 'Thuốc Giảm Đau, Hạ Sốt, Kháng Viêm'),
('c5555555-5555-5555-5555-555555555555', 'Vitamin & Thực phẩm chức năng');

-- 2. Insert Products (Dữ Liệu Mẫu Thuốc Thực Tế tại VN)
INSERT INTO public.products (id, category_id, name, description, usage, side_effect, dosage, warning) VALUES 
-- Danh mục 1: Kháng Sinh
('f1000000-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 'Amoxicillin 500mg (Trung Ương 1)', 'Kháng sinh nhóm penicillin, tiêu diệt vi khuẩn Gram dương và âm.', 'Chỉ định nhiễm khuẩn đường hô hấp, tiết niệu, tai mũi họng.', 'Tiêu chảy, khô miệng, nổi mề đay nhẹ.', '1 viên x 2-3 lần/ngày, cách nhau 8h. Uống 5-7 ngày.', 'Phải dùng hết liều dù đã khỏi. Chống chỉ định với người dị ứng Penicillin.'),
('f1000000-0000-0000-0000-000000000002', 'c1111111-1111-1111-1111-111111111111', 'Azithromycin 250mg (Zithromax)', 'Kháng sinh nhóm Macrolid phổ rộng.', 'Đặc trị viêm họng do vi khuẩn, viêm phế quản, viêm phổi nhẹ.', 'Rối loạn tiêu hóa, chóng mặt, buồn nôn.', '1 lần/ngày. Uống trước bữa ăn 1h hoặc sau khi ăn 2h.', 'Nguy cơ gây loạn nhịp tim ở người có tiền sử bệnh tim.'),

-- Danh mục 2: Tiêu Hóa
('f2000000-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222', 'Omeprazole 20mg (Omezel)', 'Thuốc ức chế bơm proton (PPI), giảm tiết axit dạ dày.', 'Trị viêm loét dạ dày tá tràng, trào ngược thực quản (GERD).', 'Đau đầu, buồn nôn, đầy hơi.', '1 viên trước khi ăn sáng 30 phút.', 'Không nhai hoặc nghiền nát viên thuốc. Uống nguyên viên.'),
('f2000000-0000-0000-0000-000000000002', 'c2222222-2222-2222-2222-222222222222', 'Smecta (Dioctahedral smectite)', 'Gói bột uống bảo vệ niêm mạc tiêu hóa, hấp thu độc tố.', 'Trị tiêu chảy cấp và mãn tính.', 'Có thể gây táo bón nếu uống ít nước.', 'Hòa tan 1 gói với 50ml nước. 2-3 gói/ngày.', 'Bắt buộc phải kết hợp phương pháp bù nước (Oresol) khi bị tiêu chảy cấp.'),

-- Danh mục 3: Tim Mạch
('f3000000-0000-0000-0000-000000000001', 'c3333333-3333-3333-3333-333333333333', 'Amlodipine 5mg (Amlor)', 'Thuốc chẹn kênh calci, làm giãn mạch máu.', 'Điều trị tăng huyết áp vô căn, đau thắt ngực ổn định.', 'Phù nẻ mắt cá chân, đỏ bừng mặt, mệt mỏi.', '1 viên/ngày. Nên uống vào một giờ cố định mỗi sáng.', 'Cần theo dõi huyết áp thường xuyên. Không bẻ ngoặc đột ngột ngưng thuốc.'),

-- Danh mục 4: Giảm Đau Kháng Viêm
('f4000000-0000-0000-0000-000000000001', 'c4444444-4444-4444-4444-444444444444', 'Panadol Extra (Paracetamol + Caffeine)', 'Thuốc giảm đau, hạ sốt có tăng cường caffeine để giảm buồn ngủ.', 'Chữa đau đầu, đau răng, đau cơ gân, cảm sốt nặng.', 'Bồn chồn, mất ngủ do lượng caffeine.', '1-2 viên/lần. Tối đa 8 viên/24 giờ.', 'Tuyệt đối KHÔNG kết hợp rượu bia. Cẩn thận suy gan.'),
('f4000000-0000-0000-0000-000000000002', 'c4444444-4444-4444-4444-444444444444', 'Diclofenac 50mg', 'Thuốc kháng viêm không steroid (NSAID), tác dụng rất mạnh.', 'Viêm khớp xương, viêm đa khớp dạng thấp, đau cấp tính.', 'Nguy cơ loét dạ dày rất cao, xuất huyết tiêu hóa.', '1 viên x 2-3 lần/ngày. Phải uống SANG KHI ĂN NO.', 'Bệnh nhân có tiền sử đau dạ dày phải uống kèm thuốc bảo vệ dạ dày như Omeprazole.'),

-- Danh mục 5: Vitamin
('f5000000-0000-0000-0000-000000000001', 'c5555555-5555-5555-5555-555555555555', 'Berberin 100mg (Viên bao đường vàng)', 'Hợp chất chiết xuất thực vật cổ truyền kháng khuẩn ruột.', 'Trị lỵ trực trùng, hội chứng lỵ, tiêu chảy do nhiễm khuẩn.', 'Rất an toàn, ít tác dụng phụ.', '2-3 viên/lần, ngày 2 lần.', 'KHÔNG dùng cho phụ nữ có thai vì kích thích co bóp tử cung.');


-- 3. Insert Symptoms (Bộ Triệu Chứng Chi Tiết)
INSERT INTO public.symptoms (id, name) VALUES 
('e0000000-0000-0000-0000-000000000001', 'Sốt cao'),
('e0000000-0000-0000-0000-000000000002', 'Viêm họng'),
('e0000000-0000-0000-0000-000000000003', 'Ho có đờm'),
('e0000000-0000-0000-0000-000000000004', 'Đau rát dạ dày'),
('e0000000-0000-0000-0000-000000000005', 'Ợ chua'),
('e0000000-0000-0000-0000-000000000006', 'Tiêu chảy cấp'),
('e0000000-0000-0000-0000-000000000007', 'Đau đầu dữ dội'),
('e0000000-0000-0000-0000-000000000008', 'Đau nhức khớp');

-- 4. Insert Diseases (Bộ Bệnh Phổ Thông Nhất)
INSERT INTO public.diseases (id, name, symptom_list) VALUES 
('d1111111-1111-1111-1111-111111111111', 'Viêm Amidan Cấp (Nhiễm khuẩn hô hấp)', 'Sốt cao, Viêm họng, Ho có đờm, Sưng phù cổ họng'),
('d2222222-2222-2222-2222-222222222222', 'Trào ngược dạ dày thực quản (GERD)', 'Đau rát dạ dày, Ợ chua, Đau tức ngực, Cảm giác vướng cổ'),
('d3333333-3333-3333-3333-333333333333', 'Viêm dạ dày ruột cấp (Nhiễm độc tiêu hóa)', 'Tiêu chảy cấp, Đau cuộn bụng, Buồn nôn'),
('d4444444-4444-4444-4444-444444444444', 'Cơn đau cấp tính thần kinh', 'Đau đầu dữ dội, Đau nhức khớp do sai tư thế hoặc viêm gân');

-- 5. Insert Gợi Ý Thuốc Theo Bệnh (Mock AI logic)
INSERT INTO public.disease_product (disease_id, product_id) VALUES 
-- Viêm Amidan Hô hấp cấp -> Dùng Kháng sinh (Amoxicillin/Azithromycin) + Giảm đau sốt
('d1111111-1111-1111-1111-111111111111', 'f1000000-0000-0000-0000-000000000001'), 
('d1111111-1111-1111-1111-111111111111', 'f4000000-0000-0000-0000-000000000001'),

-- Trào ngược dạ dày -> Bơm Proton (Omezel)
('d2222222-2222-2222-2222-222222222222', 'f2000000-0000-0000-0000-000000000001'),

-- Nhiễm độc tiêu hóa -> Bao niêm mạc (Smecta) + Diệt lỵ (Berberin)
('d3333333-3333-3333-3333-333333333333', 'f2000000-0000-0000-0000-000000000002'),
('d3333333-3333-3333-3333-333333333333', 'f5000000-0000-0000-0000-000000000001'),

-- Cơn đau cấp tính -> Kháng viêm cực mạnh (Diclofenac)
('d4444444-4444-4444-4444-444444444444', 'f4000000-0000-0000-0000-000000000002');
