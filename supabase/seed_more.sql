-- Bổ sung thêm nhiều sản phẩm y tế vào database (Chạy script này ngay trên SQL Editor)

-- Thuốc Kháng Sinh & Kháng Nấm (Thêm 3)
INSERT INTO public.products (category_id, name, description, usage, side_effect, dosage, warning) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Cefixim 200mg', 'Kháng sinh nhóm cephalosporin thế hệ 3, phổ kháng khuẩn rộng.', 'Trị viêm tai giữa, viêm họng, viêm amidan, loét dạ dày nhánh.', 'Tiêu chảy, đau bụng, nôn mửa.', 'Người lớn: 400mg/ngày, chia 1-2 lần.', 'Thận trọng với người bệnh thần kinh và tiêu hóa kém.'),
('c1111111-1111-1111-1111-111111111111', 'Clotrimazole 1% Cream', 'Thuốc bôi ngoài da trị nấm cực kỳ hiệu quả.', 'Đặc trị nấm da ngứa, nấm kẽ chân, hắc lào, lang ben.', 'Mẩn đỏ, ngứa rát nhẹ tại vị trí bôi.', 'Bôi 1 lớp mỏng 2-3 lần/ngày, kéo dài 2-4 tuần.', 'Không bôi lên vùng da trầy xước tổn thương hở.'),
('c1111111-1111-1111-1111-111111111111', 'Fluconazole 150mg', 'Thuốc trị nấm đường uống mạnh mẽ.', 'Viêm đạo do nấm màng niêm mạc.', 'Đau đầu, buồn nôn, đau hơi dạ dày.', 'Uống duy nhất 1 viên để trị Candida âm đạo.', 'Độc cho gan. Chỉ định theo toa bác sĩ chuyên khoa.');

-- Thuốc Tiêu Hóa & Dạ Dày (Thêm 3)
INSERT INTO public.products (category_id, name, description, usage, side_effect, dosage, warning) VALUES 
('c2222222-2222-2222-2222-222222222222', 'Domperidon 10mg', 'Thuốc chống nôn và điều hòa nhu động ruột.', 'Trị nôn mửa, đầy bụng, khó tiêu do thức ăn.', 'Khô miệng, buồn ngủ li bì (hiếm gặp).', '1 viên x 3 lần/ngày, trước khi ăn 15-30 phút.', 'Tối đa không qua 3 viên 1 ngày, dễ gây loạn nhịp tim.'),
('c2222222-2222-2222-2222-222222222222', 'Men Vi Sinh Enterogermina', 'Hỗn dịch bổ sung bào tử lợi khuẩn đa chủng đường ruột.', 'Rối loạn hệ vi sinh đường ruột do dùng nhiều kháng sinh.', 'Hoàn toàn không có tác dụng phụ.', '1-2 ống/ngày, Lắc kỹ trước khi uống.', 'Uống cách xa bữa ăn và cách thời gian uống thuốc kháng sinh tối thiểu 2h.'),
('c2222222-2222-2222-2222-222222222222', 'Oresol 245 (Cam)', 'Bột pha dịch bù nước và chất điện giải thiết yếu.', 'Điều trị mất nước do tiêu chảy cấp hoặc nôn ói nhiều.', 'Không tác dụng phụ nếu pha đúng tỷ lệ.', 'Pha 1 gói với đúng 200ml nước đun sôi để nguội. Uống rải rác trong ngày.', 'Tuyệt đối KHÔNG chia nhỏ gói thuốc để pha. Pha xong chỉ dùng trong 24h.');

-- Thuốc Tim Mạch & Huyết Áp (Thêm 2)
INSERT INTO public.products (category_id, name, description, usage, side_effect, dosage, warning) VALUES 
('c3333333-3333-3333-3333-333333333333', 'Losartan 50mg', 'Chất đối kháng thụ thể Angiotensin II, kiểm soát huyết áp.', 'Điều trị cao huyết áp vô căn, bảo vệ thận cho người tiểu đường.', 'Chóng mặt, hạ huyết áp tư thế đứng.', 'Khởi đầu 50mg/lần/ngày. Có thể tăng tùy bác sĩ.', 'Thường xuyên theo dõi nhịp tim và không ngừng thuốc đột ngột.'),
('c3333333-3333-3333-3333-333333333333', 'Atorvastatin 20mg', 'Thuốc nhóm statin, hạ Cholesterol và mỡ trong máu.', 'Chữa rối loạn lipid máu, ngăn chặn ngừa nhồi máu cơ tim.', 'Đau mỏi cơ bắp, khó tiêu.', '1 viên x 1 lần/ngày, ưu tiên uống buổi tối.', 'Hạn chế ăn bưởi khi uống thuốc. Kiểm tra men gan định kỳ hàng quý.');

-- Thuốc Giảm Đau, Hạ Sốt, Kháng Viêm (Thêm 4)
INSERT INTO public.products (category_id, name, description, usage, side_effect, dosage, warning) VALUES 
('c4444444-4444-4444-4444-444444444444', 'Ibuprofen 400mg', 'Thuốc kháng viêm không steroid (NSAID).', 'Giảm nhanh cơn đau đầu, đau răng, đau bụng kinh, viêm xương khớp.', 'Loét bao tử, trào ngược acid.', '1 viên mỗi 6-8 giờ sau bữa ăn. Không quá 3 viên/ngày.', 'Không dùng cho người xuất huyết tiêu hóa hay mắc sốt xuất huyết.'),
('c4444444-4444-4444-4444-444444444444', 'Effer-Paralmax 500mg', 'Viên sủi paracetamol bọt hương sủi cam dễ uống.', 'Hạ sốt, cảm lạnh, đau mình mẩy do cảm cúm virus.', 'Mẩn ngứa (hiếm).', 'Hòa tan 1 viên sủi với 200ml nước cất. Tối đa 4 viên/ngày.', 'Chưa nên uống khi xót ruột, kiêng uống rượu do hại Gan.'),
('c4444444-4444-4444-4444-444444444444', 'Alpha Choay (Chymotrypsin)', 'Men kháng viêm chống sưng phù nề sau phẫu thuật, va chạm.', 'Giảm phù nề, tiêu mủ viêm, dịu cổ họng sưng tấy.', 'Thay đổi sắc tố da cục bộ (hiếm).', 'Ngậm dưới lưỡi 4-6 viên/ngày. Chia nhiều lần.', 'Hiệu quả cao nhất khi ngậm cho thuốc rã từ từ dưới lưỡi thay vì nuốt chửng.'),
('c4444444-4444-4444-4444-444444444444', 'Salonpas Gel 30g', 'Tuýp gel thoa ngoài da giảm chấn thương thể thao.', 'Trị đau nhức cơ bắp, bong gân, bầm tím, đau lưng do căng cơ.', 'Rát ở khu vực da mỏng mẫn cảm.', 'Bôi 1 lớp vừa đủ lên vùng đau, xoa bóp nhẹ. Ngày bôi 3-4 lần.', 'Rửa sạch tazy ngay sau khi bôi, tránh quyệt vào mắt mũi.');

-- Vitamin & Thực phẩm chức năng (Thêm 3)
INSERT INTO public.products (category_id, name, description, usage, side_effect, dosage, warning) VALUES 
('c5555555-5555-5555-5555-555555555555', 'Vitamin C 1000mg', 'Cung cấp năng lượng, tăng sức đề kháng.', 'Ngừa chảy máu chân răng, chống lão hóa, da vẻ sáng mịn.', 'Buồn nôn, sỏi thận nếu dùng lâu.', '1 viên sủi/ngày pha nước lọc.', 'Nên uống sáng, cấm uống ban đêm để tránh mất ngủ.'),
('c5555555-5555-5555-5555-555555555555', 'Dầu cá Omega-3 1000mg', 'Viên dầu cá bảo vệ trí não, tim mạch và bổ mắt.', 'Tăng cường thị lực, giảm xơ vữa động mạch.', 'Ợ có mùi cá, tiêu chảy nhẹ.', 'Uống 1-2 viên ngay SANG SAU BỮA ĂN NHIỀU CHẤT BÉO.', 'Người có vấn đề loãng máu, máu khó đông cần tư vấn bác sĩ.'),
('c5555555-5555-5555-5555-555555555555', 'Sắt Folic Acid', 'Bổ sung thiếu máu do thiếu Sắt và chống dị tật ống thần kinh thai nhi.', 'Thiếu máu cho bà bầu, thai nhi, người suy nhược.', 'Đi đại tiện phân màu đen (Hoàn toàn bình thường), Táo bón nặng.', '1 viên/ngày. Uống xa bữa ăn, kèm vitamin C để tăng tổng hợp hấp thụ tối đa chất Sắt.', 'Tuyệt đối không uống kèm với sữa hoặc thuốc canxi.');
