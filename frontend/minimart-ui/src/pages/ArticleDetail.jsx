import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Dữ liệu bài viết mẫu (có thể chuyển sang API sau)
const articles = [
    {
        id: 1,
        title: "Cách chọn rau củ tươi ngon tại siêu thị",
        excerpt: "Hướng dẫn chi tiết cách nhận biết rau củ tươi, đảm bảo an toàn thực phẩm.",
        image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800",
        content: `
            <h2>Cách chọn rau củ tươi ngon</h2>
            <p>Khi mua rau củ tại siêu thị MiniMart, bạn cần chú ý đến những dấu hiệu sau để chọn được sản phẩm tươi ngon nhất:</p>
            <ul>
                <li><strong>Màu sắc tự nhiên:</strong> Rau củ tươi thường có màu sắc tươi sáng, không bị úa vàng.</li>
                <li><strong>Cấu trúc chắc chắn:</strong> Sờ vào phải cảm nhận được độ cứng, không mềm nhũn.</li>
                <li><strong>Không có vết thâm:</strong> Tránh những quả có vết đốm đen hoặc thâm tím.</li>
            </ul>
            <p>Tại MiniMart, chúng tôi cam kết cung cấp rau củ được kiểm định chất lượng, nhập trực tiếp từ nông trại uy tín.</p>
            <h3>Lợi ích của rau củ tươi</h3>
            <p>Rau củ tươi chứa nhiều vitamin và khoáng chất thiết yếu cho cơ thể, giúp tăng cường sức khỏe và ngăn ngừa bệnh tật.</p>
            <h3>Hướng dẫn chọn rau củ theo mùa</h3>
            <p>Mỗi loại rau củ có mùa vụ riêng, khi chọn đúng mùa sẽ đảm bảo độ tươi ngon và giá cả hợp lý:</p>
            <ul>
                <li><strong>Mùa xuân:</strong> Rau má, diếp cá, cà rốt baby</li>
                <li><strong>Mùa hè:</strong> Ớt, cà, bí đỏ, dưa leo</li>
                <li><strong>Mùa thu:</strong> Bắp cải, súp lơ, khoai lang</li>
                <li><strong>Mùa đông:</strong> Cải thảo, hành tây, tỏi</li>
            </ul>
            <h3>Cách bảo quản rau củ tại nhà</h3>
            <p>Để giữ rau củ tươi lâu, hãy áp dụng những mẹo sau:</p>
            <ol>
                <li>Không rửa rau củ trước khi bảo quản</li>
                <li>Đặt rau lá vào tủ lạnh với túi zip</li>
                <li>Củ quả để nơi khô ráo, thoáng mát</li>
                <li>Tránh ánh nắng trực tiếp</li>
            </ol>
            <p>MiniMart cung cấp dịch vụ giao hàng tận nhà trong vòng 2 giờ, đảm bảo rau củ đến tay bạn vẫn giữ độ tươi ngon.</p>
            <h3>Mẹo nấu ăn với rau củ</h3>
            <p>Rau củ có thể chế biến thành nhiều món ngon:</p>
            <ul>
                <li>Salad rau củ với dầu olive</li>
                <li>Canh rau nấu với thịt bằm</li>
                <li>Rau xào tỏi với dầu dừa</li>
                <li>Nước ép rau củ detox</li>
            </ul>
            <p>Hãy ghé MiniMart để khám phá thêm các loại rau củ organic nhập khẩu từ châu Âu!</p>
        `
    },
    {
        id: 2,
        title: "Top 10 thực phẩm hữu cơ tốt cho sức khỏe",
        excerpt: "Khám phá những thực phẩm hữu cơ hàng đầu giúp cải thiện sức khỏe hàng ngày.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        content: `
            <h2>Top 10 thực phẩm hữu cơ</h2>
            <p>Thực phẩm hữu cơ tại MiniMart được nuôi trồng không sử dụng hóa chất, đảm bảo an toàn tuyệt đối:</p>
            <ol>
                <li><strong>Bơ hữu cơ:</strong> Chứa nhiều chất béo tốt cho tim mạch.</li>
                <li><strong>Cà chua organic:</strong> Giàu lycopene, tốt cho da và mắt.</li>
                <li><strong>Táo organic:</strong> Cung cấp fiber và vitamin C dồi dào.</li>
                <li><strong>Gà ta thả vườn:</strong> Thịt dai, ít mỡ, giàu protein.</li>
                <li><strong>Mật ong nguyên chất:</strong> Kháng sinh tự nhiên, tốt cho tiêu hóa.</li>
                <li><strong>Trái cây nhiệt đới:</strong> Kiwi, xoài, dứa organic tươi ngon.</li>
                <li><strong>Rau lá xanh:</strong> Rau bina, cải xoăn giàu sắt và folate.</li>
                <li><strong>Hạt dinh dưỡng:</strong> Hạnh nhân, óc chó, hạt chia organic.</li>
                <li><strong>Sữa organic:</strong> Không kháng sinh, tốt cho trẻ em.</li>
                <li><strong>Gạo lứt organic:</strong> Giàu chất xơ, hỗ trợ giảm cân.</li>
            </ol>
            <p>MiniMart cam kết nguồn gốc rõ ràng cho tất cả sản phẩm hữu cơ.</p>
            <h3>Lợi ích của thực phẩm hữu cơ</h3>
            <p>Thực phẩm organic không chỉ an toàn mà còn mang lại nhiều lợi ích sức khỏe:</p>
            <ul>
                <li>Giàu dinh dưỡng hơn nhờ đất trồng tự nhiên</li>
                <li>Không chứa dư lượng thuốc trừ sâu</li>
                <li>Hỗ trợ hệ sinh thái và môi trường</li>
                <li>Có hương vị tự nhiên đậm đà hơn</li>
            </ul>
            <h3>Cách nhận biết thực phẩm organic</h3>
            <p>Để đảm bảo bạn mua đúng sản phẩm organic:</p>
            <ol>
                <li>Kiểm tra tem chứng nhận organic</li>
                <li>Quan sát màu sắc và cấu trúc tự nhiên</li>
                <li>Hỏi nguồn gốc từ nhân viên</li>
                <li>Mua tại cửa hàng uy tín như MiniMart</li>
            </ol>
            <h3>Công thức nấu ăn với thực phẩm organic</h3>
            <p>Hãy thử những món ăn healthy từ nguyên liệu organic:</p>
            <ul>
                <li>Salad gà organic với rau bina</li>
                <li>Sinh tố bơ organic với chuối</li>
                <li>Cơm gạo lứt với rau củ hấp</li>
                <li>Nước ép táo organic detox</li>
            </ul>
            <p>MiniMart có chương trình tư vấn dinh dưỡng miễn phí cho khách hàng mua organic. Hãy liên hệ hotline 1900 1234 để biết thêm chi tiết!</p>
        `
    },
    {
        id: 3,
        title: "Bí quyết nấu ăn với nguyên liệu tươi",
        excerpt: "Mẹo hay để giữ trọn vẹn dinh dưỡng khi chế biến thực phẩm.",
        image: "https://www.lorca.vn/wp-content/uploads/2022/02/Bi-quyet-nau-an-5-1536x1024.jpg",
        content: `
            <h2>Bí quyết nấu ăn với nguyên liệu tươi</h2>
            <p>Để giữ trọn vẹn dinh dưỡng từ thực phẩm tươi, hãy áp dụng những bí quyết sau:</p>
            <h3>Chuẩn bị nguyên liệu</h3>
            <ul>
                <li>Rửa rau củ dưới nước chảy, ngâm nước muối loãng 10 phút.</li>
                <li>Cắt rau ngay trước khi nấu để tránh oxy hóa vitamin C.</li>
                <li>Thịt cá nên ướp gia vị trước 15-30 phút.</li>
            </ul>
            <h3>Phương pháp nấu</h3>
            <ul>
                <li><strong>Hấp:</strong> Giữ nguyên 90% dinh dưỡng, phù hợp rau củ.</li>
                <li><strong>Luộc:</strong> Thêm chút muối, nước sôi mới cho thực phẩm vào.</li>
                <li><strong>Xào:</strong> Dùng dầu olive, nhiệt độ cao, đảo nhanh.</li>
            </ul>
            <p>Tại MiniMart, chúng tôi có khu vực demo nấu ăn để bạn học hỏi thêm.</p>
            <h3>Mẹo giữ màu rau củ khi nấu</h3>
            <p>Để rau củ giữ được màu sắc tươi ngon:</p>
            <ul>
                <li>Thêm chút giấm hoặc chanh khi luộc rau xanh</li>
                <li>Đun sôi nước trước khi cho cà rốt vào</li>
                <li>Tránh đun quá lâu với nhiệt độ cao</li>
                <li>Dùng nồi thủy tinh thay vì nồi kim loại</li>
            </ul>
            <h3>Kết hợp thực phẩm hợp lý</h3>
            <p>Để tăng hấp thu dinh dưỡng, hãy kết hợp:</p>
            <ul>
                <li>Rau xanh với thịt đỏ để tăng hấp thu sắt</li>
                <li>Cà chua với dầu olive để hấp thu lycopene</li>
                <li>Chanh với rau bina để tăng vitamin C</li>
                <li>Gừng với thịt gà để dễ tiêu hóa</li>
            </ul>
            <h3>Công thức món ăn đơn giản</h3>
            <p>Thử ngay những món ăn healthy tại nhà:</p>
            <ol>
                <li><strong>Canh rau nấu thịt:</strong> Thịt bằm + rau bina + nấm</li>
                <li><strong>Gà xào rau củ:</strong> Ức gà + bông cải + cà rốt</li>
                <li><strong>Salad tươi:</strong> Rau xà lách + cà chua + dưa leo + dầu olive</li>
                <li><strong>Nước ép detox:</strong> Củ dền + cà rốt + táo + chanh</li>
            </ol>
            <p>MiniMart cung cấp kit nguyên liệu nấu ăn sẵn, giúp bạn tiết kiệm thời gian. Đặt hàng online ngay để nhận ưu đãi 10%!</p>
        `
    },
    {
        id: 4,
        title: "Khuyến mãi tháng này tại MiniMart",
        excerpt: "Đừng bỏ lỡ những ưu đãi hấp dẫn trong tháng này với giảm giá lên đến 50%.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        content: `
            <h2>Khuyến mãi tháng này</h2>
            <p>MiniMart mang đến chương trình khuyến mãi đặc biệt với hàng ngàn ưu đãi:</p>
            <h3>Giảm giá sản phẩm</h3>
            <ul>
                <li><strong>Rau củ quả:</strong> Giảm 20% cho đơn hàng từ 200k</li>
                <li><strong>Thịt cá tươi:</strong> Mua 2 tặng 1 cho các loại thịt gà</li>
                <li><strong>Sản phẩm hữu cơ:</strong> Giảm 30% cho thành viên VIP</li>
            </ul>
            <h3>Ưu đãi đặc biệt</h3>
            <ul>
                <li>Tích điểm đổi quà: Mỗi 100k tích 10 điểm</li>
                <li>Miễn phí giao hàng cho đơn từ 300k</li>
                <li>Flash sale hàng tuần vào thứ 3, 5, 7</li>
            </ul>
            <p>Đăng ký thẻ thành viên ngay để nhận ưu đãi độc quyền!</p>
            <h3>Chương trình tích điểm</h3>
            <p>Hệ thống tích điểm MiniMart Rewards:</p>
            <ul>
                <li>Mỗi 100.000đ mua hàng tích 10 điểm</li>
                <li>500 điểm đổi voucher 50.000đ</li>
                <li>1.000 điểm đổi voucher 100.000đ</li>
                <li>Điểm không hết hạn trong năm</li>
            </ul>
            <h3>Ưu đãi theo ngày</h3>
            <p>Mỗi ngày trong tuần có ưu đãi riêng:</p>
            <ul>
                <li><strong>Thứ 2:</strong> Ngày rau củ - giảm 15%</li>
                <li><strong>Thứ 3:</strong> Flash sale thịt cá - mua 1 tặng 1</li>
                <li><strong>Thứ 4:</strong> Ngày sữa organic - giảm 25%</li>
                <li><strong>Thứ 5:</strong> Happy hour 16h-18h - giảm 10%</li>
                <li><strong>Thứ 6:</strong> Ngày gia vị - combo tiết kiệm</li>
                <li><strong>Thứ 7:</strong> Miễn phí giao hàng toàn quốc</li>
                <li><strong>Chủ nhật:</strong> Ngày gia đình - combo 4 người</li>
            </ul>
            <h3>Cách nhận ưu đãi</h3>
            <ol>
                <li>Tải app MiniMart để nhận voucher ngay</li>
                <li>Đăng ký email để nhận tin khuyến mãi</li>
                <li>Theo dõi fanpage để cập nhật deal hot</li>
                <li>Đăng ký thẻ thành viên tại cửa hàng</li>
            </ol>
            <p>MiniMart cam kết giá tốt nhất thị trường. Nếu bạn tìm thấy giá rẻ hơn, chúng tôi hoàn tiền gấp đôi!</p>
        `
    },
    {
        id: 5,
        title: "Hướng dẫn mua sắm online an toàn",
        excerpt: "Mẹo để mua sắm trực tuyến tại MiniMart một cách an toàn và thuận tiện.",
        image: "https://media.anhp.vn/files/2025/09MH%20138.png",
        content: `
            <h2>Mua sắm online an toàn</h2>
            <p>MiniMart đảm bảo trải nghiệm mua sắm trực tuyến tuyệt vời với những tính năng bảo mật:</p>
            <h3>Bước đặt hàng</h3>
            <ol>
                <li>Chọn sản phẩm và thêm vào giỏ hàng</li>
                <li>Kiểm tra lại đơn hàng và thông tin giao hàng</li>
                <li>Chọn phương thức thanh toán an toàn</li>
                <li>Xác nhận và theo dõi đơn hàng</li>
            </ol>
            <h3>Tính năng bảo mật</h3>
            <ul>
                <li>Mã hóa SSL 256-bit cho mọi giao dịch</li>
                <li>Hỗ trợ thanh toán qua VNPay, Momo, ZaloPay</li>
                <li>Đội ngũ chăm sóc khách hàng 24/7</li>
                <li>Chính sách đổi trả trong 7 ngày</li>
            </ul>
            <p>Tải app MiniMart để nhận ưu đãi giao hàng miễn phí!</p>
            <h3>Hướng dẫn thanh toán an toàn</h3>
            <p>Các phương thức thanh toán được bảo mật cao:</p>
            <ul>
                <li><strong>Thẻ tín dụng/ghi nợ:</strong> Mã hóa 3D Secure</li>
                <li><strong>Ví điện tử:</strong> Liên kết với tài khoản ngân hàng</li>
                <li><strong>Chuyển khoản:</strong> Thông tin tài khoản được mã hóa</li>
                <li><strong>Thanh toán khi nhận hàng:</strong> Cho đơn dưới 2 triệu</li>
            </ul>
            <h3>Chính sách giao hàng</h3>
            <p>MiniMart cam kết giao hàng nhanh chóng:</p>
            <ul>
                <li>Nội thành Hà Nội: 2-4 giờ</li>
                <li>Nghệ An, Thanh Hóa: 1-2 ngày</li>
                <li>Các tỉnh khác: 2-3 ngày</li>
                <li>Miễn phí giao hàng từ 300k</li>
            </ul>
            <h3>Chính sách đổi trả</h3>
            <p>Khách hàng hoàn toàn yên tâm mua sắm:</p>
            <ol>
                <li>Đổi trả trong 7 ngày kể từ ngày nhận hàng</li>
                <li>Sản phẩm còn nguyên seal, tem mác</li>
                <li>Hoàn tiền 100% hoặc đổi sản phẩm mới</li>
                <li>Miễn phí vận chuyển đổi trả</li>
            </ol>
            <h3>Mẹo mua sắm thông minh</h3>
            <p>Để có trải nghiệm tốt nhất:</p>
            <ul>
                <li>So sánh giá và đọc đánh giá sản phẩm</li>
                <li>Tham khảo chương trình khuyến mãi</li>
                <li>Chọn thời điểm đặt hàng hợp lý</li>
                <li>Lưu lại mã đơn hàng để theo dõi</li>
            </ul>
            <p>MiniMart có đội ngũ tư vấn viên chuyên nghiệp, sẵn sàng hỗ trợ bạn 24/7 qua hotline 1900 1234 hoặc chat trực tuyến.</p>
        `
    },
    {
        id: 6,
        title: "Lợi ích của việc ăn uống lành mạnh tại MiniMart",
        excerpt: "Khám phá cách thức ăn uống lành mạnh giúp cải thiện cuộc sống và tại sao MiniMart là lựa chọn hoàn hảo.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
        content: `
            <h2>Lợi ích của việc ăn uống lành mạnh</h2>
            <p>Ăn uống lành mạnh không chỉ giúp duy trì sức khỏe mà còn cải thiện chất lượng cuộc sống. Tại MiniMart, chúng tôi cung cấp những sản phẩm tươi ngon, an toàn để hỗ trợ lối sống này.</p>
            <h3>Các lợi ích chính</h3>
            <ul>
                <li><strong>Tăng cường năng lượng:</strong> Thực phẩm tươi cung cấp dưỡng chất cần thiết, giúp bạn tràn đầy sức sống.</li>
                <li><strong>Hỗ trợ giảm cân:</strong> Rau củ quả ít calo, giàu chất xơ giúp kiểm soát cân nặng hiệu quả.</li>
                <li><strong>Củng cố hệ miễn dịch:</strong> Vitamin và khoáng chất từ thực phẩm organic tăng cường đề kháng.</li>
                <li><strong>Cải thiện tâm trạng:</strong> Chế độ ăn cân bằng giúp giảm stress và cải thiện giấc ngủ.</li>
                <li><strong>Ngăn ngừa bệnh tật:</strong> Giảm nguy cơ mắc các bệnh mãn tính như tim mạch, tiểu đường.</li>
            </ul>
            <h3>Mẹo ăn uống lành mạnh tại MiniMart</h3>
            <p>Hãy bắt đầu bằng cách:</p>
            <ol>
                <li>Chọn rau củ theo mùa để đảm bảo tươi ngon và dinh dưỡng tối ưu.</li>
                <li>Kết hợp protein nạc từ thịt gà, cá với rau xanh trong mỗi bữa ăn.</li>
                <li>Uống đủ 2 lít nước lọc mỗi ngày, có thể thêm chanh hoặc bạc hà.</li>
                <li>Ăn sáng đầy đủ để cung cấp năng lượng cho cả ngày.</li>
                <li>Giới hạn đồ chiên rán, ưu tiên hấp, luộc hoặc nướng.</li>
            </ol>
            <p>MiniMart không chỉ bán thực phẩm mà còn là người bạn đồng hành trên hành trình sống khỏe. Hãy ghé thăm chúng tôi để khám phá thêm các sản phẩm hữu cơ và nhận tư vấn dinh dưỡng miễn phí!</p>
            <h3>Chế độ ăn healthy cho từng độ tuổi</h3>
            <p>Ăn uống lành mạnh phải phù hợp với từng giai đoạn phát triển:</p>
            <h4>Trẻ em (2-12 tuổi)</h4>
            <ul>
                <li>Ưu tiên sữa, trứng, thịt nạc</li>
                <li>Rau củ xay nhuyễn hoặc cắt nhỏ</li>
                <li>Trái cây tươi làm món tráng miệng</li>
                <li>Hạn chế đường và đồ chiên</li>
            </ul>
            <h4>Thanh thiếu niên (13-18 tuổi)</h4>
            <ul>
                <li>Tăng cường protein cho sự phát triển</li>
                <li>Canxi từ sữa và rau xanh</li>
                <li>Omega-3 từ cá biển</li>
                <li>Trái cây khô làm snack</li>
            </ul>
            <h4>Người lớn (19-50 tuổi)</h4>
            <ul>
                <li>Cân bằng macronutrients</li>
                <li>Giàu chất chống oxy hóa</li>
                <li>Kiểm soát cholesterol</li>
                <li>Hỗ trợ sức khỏe tim mạch</li>
            </ul>
            <h4>Người cao tuổi (50+)</h4>
            <ul>
                <li>Dễ tiêu hóa, ít chất béo</li>
                <li>Canxi và vitamin D cao</li>
                <li>Chất xơ chống táo bón</li>
                <li>Protein dễ hấp thu</li>
            </ul>
            <h3>Công thức bữa ăn healthy</h3>
            <p>Món ăn đơn giản, dinh dưỡng tại nhà:</p>
            <h4>Bữa sáng</h4>
            <ul>
                <li>Yến mạch với sữa organic và chuối</li>
                <li>Bánh mì nguyên cám với trứng luộc</li>
                <li>Sinh tố rau củ detox</li>
            </ul>
            <h4>Bữa trưa</h4>
            <ul>
                <li>Cơm gạo lứt với gà hấp rau củ</li>
                <li>Salad gà với rau xanh</li>
                <li>Canh rau nấu thịt nạc</li>
            </ul>
            <h4>Bữa tối</h4>
            <ul>
                <li>Cá nướng với rau luộc</li>
                <li>Súp rau củ với bánh mì</li>
                <li>Yogurt organic với hạt</li>
            </ul>
            <p>MiniMart có khu vực tư vấn dinh dưỡng với chuyên gia, giúp bạn xây dựng thực đơn phù hợp. Đặt lịch tư vấn miễn phí ngay hôm nay!</p>
        `
    }
];

const ArticleDetail = () => {
    const { id } = useParams();
    const article = articles.find(a => a.id === parseInt(id));

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Bài viết không tồn tại</h1>
                    <p className="text-gray-600 mb-6">Bài viết bạn tìm kiếm không có sẵn.</p>
                    <Link to="/" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
                        Trang chủ
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-600">Bài viết</span>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">{article.title}</span>
                </nav>

                {/* Article Content */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-64 md:h-96 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600?text=No+Image' }}
                    />

                    <div className="p-8">
                        <div className="flex items-center mb-4">
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                Bài viết hữu ích
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {article.excerpt}
                        </p>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-2/3">
                                <div
                                    className="prose prose-lg max-w-none leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>
                            <aside className="lg:w-1/3 sticky top-28 h-fit space-y-4">
                                {/* Ưu đãi độc quyền */}
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-lg animate-in fade-in slide-in-from-right duration-700">
                                    <h3 className="text-lg font-bold text-emerald-800 mb-4">Ưu đãi độc quyền</h3>
                                    
                                    {/* 3 Card Ưu Đãi */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white p-3 rounded-lg text-center border border-emerald-200 hover:shadow-md hover:border-emerald-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                                            <div className="text-2xl font-bold text-red-500 mb-1">-20%</div>
                                            <p className="text-xs text-gray-600">Rau Củ</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg text-center border border-emerald-200 hover:shadow-md hover:border-emerald-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                                            <div className="text-2xl font-bold text-orange-500 mb-1">Mua 2</div>
                                            <p className="text-xs text-gray-600">Tặng 1 Thịt</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg text-center border border-emerald-200 hover:shadow-md hover:border-emerald-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                                            <div className="text-2xl font-bold text-blue-500 mb-1">Miễn</div>
                                            <p className="text-xs text-gray-600">Ship 300k+</p>
                                        </div>
                                    </div>

                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 mb-4">
                                        <li>Giảm 20% rau củ theo đơn từ 200k</li>
                                        <li>Mua 2 tặng 1 thịt cá tươi</li>
                                        <li>Đổi 500 điểm lấy voucher 50k</li>
                                        <li>Miễn phí ship với đơn từ 300k</li>
                                    </ul>
                                    
                                    <div className="p-3 bg-white rounded-lg border border-emerald-200 hover:shadow-lg transition-shadow duration-300">
                                        <p className="text-xs text-emerald-700 font-semibold uppercase mb-2">Mã khuyến mãi</p>
                                        <p className="text-xl font-bold text-emerald-800 tracking-wider">MINIMART20</p>
                                        <p className="text-xs text-gray-500 mt-1">Áp dụng cho đơn hàng online</p>
                                    </div>

                                    <Link to="/products" className="w-full mt-4 block bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 text-center">
                                        Mua ngay 🔥
                                    </Link>
                                </div>

                                {/* Quảng Cáo dưới Ưu đãi */}
                                <div className="space-y-3">
                                    {/* Quảng Cáo 1 */}
                                    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 hover:shadow-lg transition-all duration-300 hover:border-red-400 hover:scale-105 cursor-pointer">
                                        <h4 className="font-bold text-red-700 text-sm mb-2">🔥 Đi 1 lần là nghiện</h4>
                                        <p className="text-xs text-gray-700 leading-snug">
                                            Đồ tươi 🥬 – Giá xịn 💸
                                        </p>
                                    </div>

                                    {/* Quảng Cáo 2 */}
                                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300 hover:border-blue-400 hover:scale-105 cursor-pointer">
                                        <h4 className="font-bold text-blue-700 text-sm mb-2">🚀 Lười ra ngoài?</h4>
                                        <p className="text-xs text-gray-700 leading-snug">
                                            MiniMart lo hết!
                                        </p>
                                    </div>

                                    {/* Quảng Cáo 3 */}
                                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-lg transition-all duration-300 hover:border-purple-400 hover:scale-105 cursor-pointer">
                                        <h4 className="font-bold text-purple-700 text-sm mb-2">💥 Deal sốc mỗi ngày</h4>
                                        <p className="text-xs text-gray-700 leading-snug">
                                            Mua càng nhiều tiết kiệm 🛍️
                                        </p>
                                    </div>

                                    {/* Quảng Cáo 4 */}
                                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:border-yellow-400 hover:scale-105 cursor-pointer">
                                        <h4 className="font-bold text-yellow-700 text-sm mb-2">⭐ VIP được ưu tiên</h4>
                                        <p className="text-xs text-gray-700 leading-snug">
                                            Ưu đãi cao nhất 🎁
                                        </p>
                                    </div>

                                    {/* Quảng Cáo 5 */}
                                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-lg transition-all duration-300 hover:border-green-400 hover:scale-105 cursor-pointer">
                                        <h4 className="font-bold text-green-700 text-sm mb-2">🌱 Organic 100%</h4>
                                        <p className="text-xs text-gray-700 leading-snug">
                                            Tươi – An toàn ✓
                                        </p>
                                    </div>

                                    {/* Quảng Cáo 6 */}
                                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg border border-indigo-200 hover:shadow-lg transition-all duration-300 hover:border-indigo-400 hover:scale-105 cursor-pointer">
                                        <h4 className="font-bold text-indigo-700 text-sm mb-2">📱 App MiniMart</h4>
                                        <p className="text-xs text-gray-700 leading-snug">
                                            Tải app nhận 50k 🎉
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                {/* Social Sharing */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Chia sẻ bài viết</h3>
                    <div className="flex space-x-4">
                        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <i className="fab fa-facebook"></i>
                            <span>Facebook</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition">
                            <i className="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            <i className="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                            <i className="fas fa-link"></i>
                            <span>Sao chép</span>
                        </button>
                    </div>
                </div>

                {/* Related Articles */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {articles.filter(a => a.id !== parseInt(id)).slice(0, 3).map((related) => (
                            <Link
                                key={related.id}
                                to={`/article/${related.id}`}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow block"
                            >
                                <img
                                    src={related.image}
                                    alt={related.title}
                                    className="w-full h-40 object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250?text=No+Image' }}
                                />
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {related.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Khám phá sản phẩm tại MiniMart</h3>
                    <p className="text-lg mb-6 opacity-90">
                        Đặt hàng ngay để nhận ưu đãi đặc biệt và giao hàng tận nhà
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/products"
                            className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
                        >
                            Mua sắm ngay
                        </Link>
                        <Link
                            to="/"
                            className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-emerald-600 transition"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;